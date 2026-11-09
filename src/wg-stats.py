#!/usr/bin/env python3
"""
WireGuard Stats REST API for Home Assistant
Serves on port 8888, compatible with existing vpn_stats sensor.
Reads peer friendly names from comments in /etc/wireguard/<interface>.conf.

Configuration (environment variables, all optional):
  WG_STATS_INTERFACE  WireGuard interface to report on (default: wg0)
  WG_STATS_LISTEN     Address to bind to (default: 0.0.0.0). Use your LAN IP
                      or 127.0.0.1 to avoid exposing the API on every interface.
  WG_STATS_PORT       Port to listen on (default: 8888)
  WG_STATS_TOKEN      If set, every request must send
                      "Authorization: Bearer <token>"; otherwise 401.
"""

import hmac
import json
import os
import re
import socket
import subprocess
import sys
import threading
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

WG_INTERFACE = os.environ.get("WG_STATS_INTERFACE", "wg0")
WG_CONF = f"/etc/wireguard/{WG_INTERFACE}.conf"
LISTEN_ADDR = os.environ.get("WG_STATS_LISTEN", "0.0.0.0")
LISTEN_PORT = int(os.environ.get("WG_STATS_PORT", "8888"))
AUTH_TOKEN = os.environ.get("WG_STATS_TOKEN", "")
# A peer is considered "active" if last handshake was within this many seconds
ACTIVE_THRESHOLD_SECONDS = 180


_NAME_COMMENT = re.compile(r"#+\s*(?:name|friendly[_ ]name)\s*[=:]\s*(.+?)\s*$", re.IGNORECASE)
_conf_error_logged = False


def parse_friendly_names(conf_path: str) -> dict:
    """
    Map peer public key -> friendly name from comments in the WireGuard config.

    Supported formats:
      PiVPN blocks:          ### begin <name> ###  ...  ### end <name> ###
      A comment in a [Peer]: # Name = <name>   (also "# Name: <name>")
    """
    global _conf_error_logged
    names = {}
    block_name = None    # name from an enclosing PiVPN begin/end block
    section_name = None  # "# Name = ..." comment inside the current [Peer]
    section_key = None
    section_block = None
    in_peer = False

    def flush():
        name = section_name or section_block
        if section_key and name:
            names[section_key] = name

    try:
        with open(conf_path) as f:
            for line in f:
                line = line.strip()
                begin = re.match(r"### begin (.+) ###", line)
                if begin:
                    block_name = begin.group(1)
                    continue
                if re.match(r"### end .+ ###", line):
                    block_name = None
                    continue
                if line.startswith("["):
                    flush()
                    in_peer = line.lower() == "[peer]"
                    section_name = section_key = section_block = None
                    continue
                if not in_peer:
                    continue
                name = _NAME_COMMENT.match(line)
                if name:
                    section_name = name.group(1)
                    continue
                pk = re.match(r"PublicKey\s*=\s*(\S+)", line)
                if pk:
                    section_key = pk.group(1)
                    section_block = block_name
            flush()
    except OSError as e:
        # Names fall back to a key prefix; log once instead of every poll.
        if not _conf_error_logged:
            print(f"wg-stats: can't read {conf_path} for peer names: {e}", file=sys.stderr)
            _conf_error_logged = True
        return {}
    _conf_error_logged = False
    return names


def format_duration(seconds: int) -> str:
    """Format like `wg show`: '2 hours, 34 minutes, 28 seconds' ('Now' for 0)."""
    if seconds == 0:
        return "Now"
    parts = []
    for unit, size in (("year", 365 * 24 * 3600), ("day", 24 * 3600),
                       ("hour", 3600), ("minute", 60), ("second", 1)):
        value, seconds = divmod(seconds, size)
        if value:
            parts.append(f"{value} {unit}{'' if value == 1 else 's'}")
    return ", ".join(parts)


def format_bytes(b: int) -> str:
    """Format like `wg show`: whole bytes below 1 KiB, two decimals above."""
    if b < 1024:
        return f"{b} B"
    value = float(b)
    for unit in ("KiB", "MiB", "GiB"):
        value /= 1024
        if value < 1024:
            return f"{value:.2f} {unit}"
    return f"{value / 1024:.2f} TiB"


def _none_if_empty(value: str):
    return None if value in ("", "(none)") else value


def _iso(epoch):
    return datetime.fromtimestamp(epoch, timezone.utc).isoformat() if epoch else None


# Per-peer state kept between polls, for transfer rates and "connected since".
# Requests run in parallel threads, so access goes through the lock.
_history = {}
_history_lock = threading.Lock()
# Polls closer together than this (e.g. a second client) reuse the last rate
# instead of computing a noisy one over a tiny window.
MIN_RATE_WINDOW_SECONDS = 2.0


def _track_peer(key, mono, rx, tx, connected, handshake):
    """Return (rx_rate, tx_rate, connected_since_epoch) based on earlier polls."""
    with _history_lock:
        state = _history.get(key)
        if state is None or mono - state["seen"] > ACTIVE_THRESHOLD_SECONDS:
            # First sight, or a gap long enough to have missed a disconnect:
            # no rate yet, and when an ongoing session began is unknown.
            state = {"t": mono, "rx": rx, "tx": tx, "rx_rate": None, "tx_rate": None,
                     "since": None, "connected": connected}
        else:
            dt = mono - state["t"]
            if rx < state["rx"] or tx < state["tx"]:
                # Counters went backwards: the interface restarted or the peer
                # was re-added. Start measuring again.
                state.update(t=mono, rx=rx, tx=tx, rx_rate=None, tx_rate=None)
            elif dt >= MIN_RATE_WINDOW_SECONDS:
                state.update(t=mono, rx=rx, tx=tx,
                             rx_rate=round((rx - state["rx"]) / dt),
                             tx_rate=round((tx - state["tx"]) / dt))
            if connected and not state["connected"]:
                state["since"] = handshake  # the handshake that started this session
            elif not connected:
                state["since"] = None
            state["connected"] = connected
        state["seen"] = mono
        _history[key] = state
        return state["rx_rate"], state["tx_rate"], state["since"]


def _forget_peers_except(keys):
    with _history_lock:
        for key in list(_history):
            if key not in keys:
                del _history[key]


def _error(message):
    return {"error": message, "active_peers": 0, "total_peers": 0, "peers": {}}


def get_wg_stats() -> dict:
    # `wg show <if> dump` is the machine-readable format: tab-separated,
    # exact byte counters and epoch handshake times, no locale or colour.
    try:
        result = subprocess.run(
            ["wg", "show", WG_INTERFACE, "dump"],
            capture_output=True, text=True, timeout=5
        )
    except Exception as e:
        # Log details locally; don't leak paths/internals to API clients.
        print(f"wg-stats: failed to run wg: {e}", file=sys.stderr)
        return _error("failed to run wg")
    # A missing interface or insufficient privileges exits non-zero with empty
    # stdout; report it instead of returning a valid-looking "0 peers" response.
    if result.returncode != 0:
        print(f"wg-stats: wg exited with status {result.returncode}: {result.stderr.strip()}", file=sys.stderr)
        return _error(f"wg show {WG_INTERFACE} failed")

    lines = result.stdout.splitlines()
    if not lines:
        return _error(f"wg show {WG_INTERFACE} returned no data")
    # First line: private key, public key, listen port, fwmark. Only the
    # public key and port are used; the private key is never read or returned.
    iface_fields = lines[0].split("\t")
    friendly_names = parse_friendly_names(WG_CONF)
    now = int(time.time())
    mono = time.monotonic()
    peers = []

    for line in lines[1:]:
        fields = line.split("\t")
        if len(fields) < 8:
            continue
        public_key, psk, endpoint, allowed_ips, handshake, rx, tx, keepalive = fields[:8]
        rx_bytes, tx_bytes, handshake = int(rx), int(tx), int(handshake)

        if handshake == 0:
            seconds_ago, human, handshake_at = None, None, None  # never
        elif handshake > now:
            # Clock went backwards: the age is unknown, so don't claim online.
            seconds_ago, human, handshake_at = None, "unknown (clock skew)", None
        else:
            seconds_ago = now - handshake
            human = format_duration(seconds_ago)
            handshake_at = handshake
        connected = seconds_ago is not None and seconds_ago <= ACTIVE_THRESHOLD_SECONDS
        rx_rate, tx_rate, since = _track_peer(public_key, mono, rx_bytes, tx_bytes, connected, handshake)

        allowed = _none_if_empty(allowed_ips)
        peers.append({
            "public_key": public_key,
            "friendly_name": friendly_names.get(public_key, public_key[:8] + "..."),
            "endpoint": _none_if_empty(endpoint),
            "allowed_ips": allowed.replace(",", ", ") if allowed else None,
            "latest_handshake": human,
            "latest_handshake_at": _iso(handshake_at),
            "latest_handshake_seconds_ago": seconds_ago,
            "transfer_rx_bytes": rx_bytes,
            "transfer_tx_bytes": tx_bytes,
            "transfer_rx_human": format_bytes(rx_bytes),
            "transfer_tx_human": format_bytes(tx_bytes),
            "rx_rate": rx_rate,
            "tx_rate": tx_rate,
            "connected": connected,
            "connected_since": _iso(since) if connected else None,
            "persistent_keepalive": int(keepalive) if keepalive.isdigit() else None,
            "preshared_key": psk != "(none)",
        })

    _forget_peers_except({p["public_key"] for p in peers})

    # Build response keyed by friendly name for easier HA templating.
    # Suffix duplicate names so peers sharing a name aren't silently dropped.
    peers_by_name = {}
    for p in peers:
        name = p["friendly_name"]
        n = 2
        while name in peers_by_name:
            name = f"{p['friendly_name']} ({n})"
            n += 1
        p["friendly_name"] = name
        peers_by_name[name] = p

    rx_rates = [p["rx_rate"] for p in peers if p["rx_rate"] is not None]
    tx_rates = [p["tx_rate"] for p in peers if p["tx_rate"] is not None]
    port = iface_fields[2] if len(iface_fields) > 2 else ""
    return {
        "active_peers": sum(1 for p in peers if p["connected"]),
        "total_peers": len(peers),
        "peers": peers_by_name,
        "interface": {
            "name": WG_INTERFACE,
            "public_key": iface_fields[1] if len(iface_fields) > 1 else None,
            "listen_port": int(port) if port.isdigit() else None,
            "transfer_rx_bytes": sum(p["transfer_rx_bytes"] for p in peers),
            "transfer_tx_bytes": sum(p["transfer_tx_bytes"] for p in peers),
            "rx_rate": sum(rx_rates) if rx_rates else None,
            "tx_rate": sum(tx_rates) if tx_rates else None,
        },
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }


class Handler(BaseHTTPRequestHandler):
    # Drop idle/slow connections instead of holding a thread open forever.
    timeout = 10
    # Don't advertise the Python version in the Server header.
    server_version = "wg-stats"
    sys_version = ""

    def _authorized(self) -> bool:
        if not AUTH_TOKEN:
            return True
        header = self.headers.get("Authorization", "")
        expected = f"Bearer {AUTH_TOKEN}"
        return hmac.compare_digest(header.encode(), expected.encode())

    def do_GET(self):
        if not self._authorized():
            self.send_response(401)
            self.send_header("WWW-Authenticate", "Bearer")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return

        if self.path not in ("/", "/wg"):
            self.send_response(404)
            self.send_header("Content-Length", "0")
            self.end_headers()
            return

        data = get_wg_stats()
        body = json.dumps(data, indent=2).encode()

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        pass  # suppress request logs


if __name__ == "__main__":
    # One thread per connection, so a slow or idle client can't block
    # Home Assistant's polls.
    if ":" in LISTEN_ADDR:
        ThreadingHTTPServer.address_family = socket.AF_INET6
    server = ThreadingHTTPServer((LISTEN_ADDR, LISTEN_PORT), Handler)
    auth = "token auth enabled" if AUTH_TOKEN else "no authentication"
    print(f"WireGuard stats server listening on {LISTEN_ADDR}:{LISTEN_PORT} ({auth})", flush=True)
    server.serve_forever()