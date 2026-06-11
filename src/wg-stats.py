#!/usr/bin/env python3
"""
WireGuard Stats REST API for Home Assistant
Serves on port 8888, compatible with existing vpn_stats sensor.
Reads peer friendly names from /etc/wireguard/wg0.conf comments.
"""

import json
import re
import subprocess
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer

WG_INTERFACE = "wg0"
WG_CONF = f"/etc/wireguard/{WG_INTERFACE}.conf"
LISTEN_PORT = 8888
# A peer is considered "active" if last handshake was within this many seconds
ACTIVE_THRESHOLD_SECONDS = 180


def parse_friendly_names(conf_path: str) -> dict:
    """Parse ### begin <name> ### comments from wg0.conf to map pubkey -> name."""
    names = {}
    current_name = None
    try:
        with open(conf_path) as f:
            for line in f:
                line = line.strip()
                begin = re.match(r"### begin (.+) ###", line)
                end = re.match(r"### end .+ ###", line)
                pk = re.match(r"PublicKey\s*=\s*(.+)", line)
                if begin:
                    current_name = begin.group(1)
                elif end:
                    current_name = None
                elif pk and current_name:
                    names[pk.group(1).strip()] = current_name
    except Exception:
        pass
    return names


def parse_handshake(handshake_str: str) -> tuple:
    """
    Parse WireGuard handshake string like '2 hours, 34 minutes, 28 seconds ago'
    Returns (total_seconds: int, human_readable: str)
    """
    if not handshake_str or handshake_str == "0":
        return (None, "never")

    total = 0
    patterns = [
        (r"(\d+)\s+year", 365 * 24 * 3600),
        (r"(\d+)\s+day", 24 * 3600),
        (r"(\d+)\s+hour", 3600),
        (r"(\d+)\s+minute", 60),
        (r"(\d+)\s+second", 1),
    ]
    for pattern, multiplier in patterns:
        m = re.search(pattern, handshake_str)
        if m:
            total += int(m.group(1)) * multiplier

    return (total, handshake_str.replace(" ago", "").strip())


def parse_transfer(transfer_str: str) -> tuple:
    """
    Parse transfer string like '29.10 MiB received, 1.52 GiB sent'
    Returns (received_bytes: int, sent_bytes: int)
    """
    units = {"B": 1, "KiB": 1024, "MiB": 1024**2, "GiB": 1024**3, "TiB": 1024**4}

    def to_bytes(val, unit):
        return int(float(val) * units.get(unit, 1))

    rx = re.search(r"([\d.]+)\s+(\w+)\s+received", transfer_str)
    tx = re.search(r"([\d.]+)\s+(\w+)\s+sent", transfer_str)

    rx_bytes = to_bytes(rx.group(1), rx.group(2)) if rx else 0
    tx_bytes = to_bytes(tx.group(1), tx.group(2)) if tx else 0
    return (rx_bytes, tx_bytes)


def format_bytes(b: int) -> str:
    for unit in ["B", "KiB", "MiB", "GiB", "TiB"]:
        if b < 1024:
            return f"{b:.2f} {unit}"
        b /= 1024
    return f"{b:.2f} TiB"


def get_wg_stats() -> dict:
    try:
        result = subprocess.run(
            ["wg", "show", WG_INTERFACE],
            capture_output=True, text=True, timeout=5
        )
        output = result.stdout
    except Exception as e:
        return {"error": str(e), "active_peers": 0, "total_peers": 0, "peers": {}}

    friendly_names = parse_friendly_names(WG_CONF)
    peers = {}
    current_peer = None

    for line in output.splitlines():
        line = line.strip()

        peer_match = re.match(r"peer:\s+(.+)", line)
        if peer_match:
            current_peer = peer_match.group(1).strip()
            peers[current_peer] = {
                "public_key": current_peer,
                "friendly_name": friendly_names.get(current_peer, current_peer[:8] + "..."),
                "endpoint": None,
                "allowed_ips": None,
                "latest_handshake": None,
                "latest_handshake_seconds_ago": None,
                "transfer_rx_bytes": 0,
                "transfer_tx_bytes": 0,
                "transfer_rx_human": "0 B",
                "transfer_tx_human": "0 B",
                "connected": False,
            }
            continue

        if current_peer is None:
            continue

        if line.startswith("endpoint:"):
            peers[current_peer]["endpoint"] = line.split(":", 1)[1].strip()

        elif line.startswith("allowed ips:"):
            peers[current_peer]["allowed_ips"] = line.split(":", 1)[1].strip()

        elif line.startswith("latest handshake:"):
            hs_str = line.split(":", 1)[1].strip()
            secs, human = parse_handshake(hs_str)
            peers[current_peer]["latest_handshake"] = human
            peers[current_peer]["latest_handshake_seconds_ago"] = secs
            if secs is not None and secs <= ACTIVE_THRESHOLD_SECONDS:
                peers[current_peer]["connected"] = True

        elif line.startswith("transfer:"):
            transfer_str = line.split(":", 1)[1].strip()
            rx, tx = parse_transfer(transfer_str)
            peers[current_peer]["transfer_rx_bytes"] = rx
            peers[current_peer]["transfer_tx_bytes"] = tx
            peers[current_peer]["transfer_rx_human"] = format_bytes(rx)
            peers[current_peer]["transfer_tx_human"] = format_bytes(tx)

    # Build response keyed by friendly name for easier HA templating
    peers_by_name = {p["friendly_name"]: p for p in peers.values()}
    active = sum(1 for p in peers.values() if p["connected"])

    return {
        "active_peers": active,
        "total_peers": len(peers),
        "peers": peers_by_name,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path not in ("/", "/wg"):
            self.send_response(404)
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
    server = HTTPServer(("0.0.0.0", LISTEN_PORT), Handler)
    print(f"WireGuard stats server listening on port {LISTEN_PORT}")
    server.serve_forever()