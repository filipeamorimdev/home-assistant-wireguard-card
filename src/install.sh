#!/usr/bin/env bash
# Installer for wg-stats, the WireGuard stats API used by the
# Home Assistant WireGuard Card.
# https://github.com/filipeamorimdev/home-assistant-wireguard-card
#
#   sudo ./install.sh                 install or reconfigure (interactive)
#   sudo ./install.sh upgrade         update the script and unit, keep settings
#   sudo ./install.sh uninstall       remove the service (keeps settings)
#
# Run with --help for all options.

set -euo pipefail

REPO="filipeamorimdev/home-assistant-wireguard-card"
# Release that wg-stats.py and the unit are downloaded from when this
# script isn't run from a checkout. Bumped with every release.
DEFAULT_REF="v1.1.0"

# Overridable for testing only.
BIN_PATH="${WG_STATS_BIN_PATH:-/usr/local/bin/wg-stats.py}"
UNIT_PATH="${WG_STATS_UNIT_PATH:-/etc/systemd/system/wg-stats.service}"
ENV_FILE="${WG_STATS_ENV_FILE:-/etc/default/wg-stats}"
SYSTEMD_RUN_DIR="${WG_STATS_SYSTEMD_RUN_DIR:-/run/systemd/system}"
SERVICE="wg-stats"

# ---------------------------------------------------------------- output

if [ -t 1 ]; then
  C_BOLD=$'\033[1m' C_RED=$'\033[31m' C_YEL=$'\033[33m' C_GRN=$'\033[32m' C_OFF=$'\033[0m'
else
  C_BOLD="" C_RED="" C_YEL="" C_GRN="" C_OFF=""
fi

info() { printf '%s==>%s %s\n' "$C_GRN" "$C_OFF" "$*"; }
warn() { printf '%swarning:%s %s\n' "$C_YEL" "$C_OFF" "$*" >&2; }
die()  { printf '%serror:%s %s\n' "$C_RED" "$C_OFF" "$*" >&2; exit 1; }

usage() {
  cat <<EOF
Usage: sudo $0 [install|upgrade|uninstall] [options]

Commands:
  install      Install wg-stats, or change the settings of an existing
               install (default). Current settings are used as defaults.
  upgrade      Replace the script and systemd unit; keep $ENV_FILE.
  uninstall    Stop and remove the service. Keeps $ENV_FILE unless --purge.

Options:
  -i, --interface NAME   WireGuard interface to report on (default: detected)
  -l, --listen ADDR      Address to listen on (default: this host's LAN IP)
  -p, --port PORT        Port to listen on (default: 8888)
      --no-token         Don't require an access token (not recommended)
      --new-token        Replace the existing access token with a new one
      --token KEY        Use this access token instead of generating one,
                         e.g. the key created in the card's editor
      --ref REF          Release tag or branch to download from (default: $DEFAULT_REF)
      --purge            With uninstall: also delete $ENV_FILE
  -y, --yes              Don't ask; accept the defaults
  -h, --help             Show this help
EOF
}

# ---------------------------------------------------------------- arguments

CMD="install"
IFACE="" LISTEN="" PORT=""
NO_TOKEN=0 NEW_TOKEN=0 ASSUME_YES=0 PURGE=0
GIVEN_TOKEN=""
REF="$DEFAULT_REF" REF_SET=0

need_arg() { [ "$#" -ge 2 ] && [ -n "$2" ] || die "$1 needs a value"; }

while [ "$#" -gt 0 ]; do
  case "$1" in
    install|upgrade|uninstall) CMD="$1" ;;
    -i|--interface) need_arg "$@"; IFACE="$2"; shift ;;
    -l|--listen)    need_arg "$@"; LISTEN="$2"; shift ;;
    -p|--port)      need_arg "$@"; PORT="$2"; shift ;;
    --ref)          need_arg "$@"; REF="$2"; REF_SET=1; shift ;;
    --token)        need_arg "$@"; GIVEN_TOKEN="$2"; shift ;;
    --no-token)     NO_TOKEN=1 ;;
    --new-token)    NEW_TOKEN=1 ;;
    --purge)        PURGE=1 ;;
    -y|--yes)       ASSUME_YES=1 ;;
    -h|--help)      usage; exit 0 ;;
    *) usage >&2; die "unknown argument: $1" ;;
  esac
  shift
done

[ "$NO_TOKEN" = 1 ] && [ "$NEW_TOKEN" = 1 ] && die "--no-token and --new-token can't be combined"
if [ -n "$GIVEN_TOKEN" ]; then
  [ "$CMD" = install ] || die "--token only works with install"
  [ "$NO_TOKEN" = 1 ] && die "--no-token and --token can't be combined"
  [ "$NEW_TOKEN" = 1 ] && die "--new-token and --token can't be combined"
  # The token is written to the settings file and printed into YAML, so only
  # allow URL-safe characters, and require enough of them to be unguessable.
  [[ "$GIVEN_TOKEN" =~ ^[A-Za-z0-9_-]{32,256}$ ]] \
    || die "--token must be 32-256 characters of A-Z, a-z, 0-9, '-' or '_'"
fi

# ---------------------------------------------------------------- helpers

# Prompts read from the terminal, so this also works as `curl ... | sudo bash`.
can_prompt() { [ "$ASSUME_YES" = 0 ] && (exec </dev/tty) 2>/dev/null; }

# ask "Question" default -> prints the answer (or the default)
ask() {
  local answer=""
  if can_prompt; then
    printf '%s%s%s [%s]: ' "$C_BOLD" "$1" "$C_OFF" "$2" >/dev/tty
    IFS= read -r answer </dev/tty || true
  fi
  printf '%s' "${answer:-$2}"
}

# confirm "Question" y|n -> exit status
confirm() {
  local hint="y/N" answer=""
  [ "$2" = y ] && hint="Y/n"
  if ! can_prompt; then
    [ "$2" = y ]
    return
  fi
  printf '%s%s%s [%s]: ' "$C_BOLD" "$1" "$C_OFF" "$hint" >/dev/tty
  IFS= read -r answer </dev/tty || true
  case "${answer:-$2}" in [Yy]*) return 0 ;; *) return 1 ;; esac
}

# env_get KEY -> value from the existing settings file, if any
env_get() {
  [ -f "$ENV_FILE" ] || return 0
  sed -n "s/^$1=//p" "$ENV_FILE" | tail -n 1 | sed -e 's/^"\(.*\)"$/\1/' -e "s/^'\(.*\)'$/\1/"
}

valid_iface()  { [[ "$1" =~ ^[A-Za-z0-9_.=+-]{1,15}$ ]]; }
valid_listen() { [[ "$1" =~ ^[0-9A-Fa-f:.]+$ ]]; }
valid_port()   { [[ "$1" =~ ^[0-9]{1,5}$ ]] && [ "$1" -ge 1 ] && [ "$1" -le 65535 ]; }

detect_lan_ip() {
  local ip=""
  if command -v ip >/dev/null 2>&1; then
    ip=$(ip -4 route get 1.1.1.1 2>/dev/null | sed -n 's/.* src \([0-9.]*\).*/\1/p' | head -n 1)
  fi
  if [ -z "$ip" ] && command -v hostname >/dev/null 2>&1; then
    ip=$(hostname -I 2>/dev/null | awk '{print $1}') || ip=""
  fi
  printf '%s' "$ip"
}

port_in_use() {
  command -v ss >/dev/null 2>&1 || return 1
  [ -n "$(ss -Hltn "sport = :$1" 2>/dev/null)" ]
}

fetch() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL --proto '=https' --tlsv1.2 -o "$2" "$1"
  elif command -v wget >/dev/null 2>&1; then
    wget -q --https-only -O "$2" "$1"
  else
    die "curl or wget is needed to download $1"
  fi
}

# ---------------------------------------------------------------- checks

preflight() {
  [ "$(id -u)" -eq 0 ] || die "please run as root (sudo $0 ...)"
  command -v systemctl >/dev/null 2>&1 && [ -d "$SYSTEMD_RUN_DIR" ] \
    || die "systemd is required; see the manual setup steps in the README"
  if [ "$CMD" = uninstall ]; then return 0; fi

  PYTHON=$(command -v python3 || true)
  [ -n "$PYTHON" ] || die "python3 is required (e.g. sudo apt install python3)"
  [[ "$PYTHON" =~ ^[A-Za-z0-9_./-]+$ ]] || die "unsupported python3 path: $PYTHON"
  "$PYTHON" -c 'import sys; sys.exit(sys.version_info < (3, 7))' \
    || die "python3 3.7 or newer is required ($("$PYTHON" --version 2>&1))"
  command -v wg >/dev/null 2>&1 || die "wg not found; install wireguard-tools first"
  [[ "$REF" =~ ^[A-Za-z0-9._/-]+$ ]] || die "invalid --ref: $REF"
}

# ---------------------------------------------------------------- sources

SRC_DIR=""
TMP_DIR=""
cleanup() { [ -n "$TMP_DIR" ] && rm -rf "$TMP_DIR"; return 0; }
trap cleanup EXIT

get_sources() {
  local here="" self="${BASH_SOURCE[0]:-}"
  # Use the files next to this script when run from a checkout or an
  # extracted release. When piped (curl ... | bash) there is no script path,
  # so always download rather than trusting the current directory.
  if [ -n "$self" ] && [ -f "$self" ]; then
    here=$(cd "$(dirname "$self")" && pwd) || here=""
  fi
  if [ "$REF_SET" = 0 ] && [ -n "$here" ] && [ -f "$here/wg-stats.py" ] && [ -f "$here/wg-stats.service" ]; then
    SRC_DIR="$here"
    info "Using wg-stats.py and wg-stats.service from $SRC_DIR"
  else
    TMP_DIR=$(mktemp -d)
    SRC_DIR="$TMP_DIR"
    local base="https://raw.githubusercontent.com/$REPO/$REF/src"
    info "Downloading wg-stats $REF from github.com/$REPO"
    fetch "$base/wg-stats.py" "$SRC_DIR/wg-stats.py" || die "download failed: $base/wg-stats.py"
    fetch "$base/wg-stats.service" "$SRC_DIR/wg-stats.service" || die "download failed: $base/wg-stats.service"
  fi
  "$PYTHON" -I -c 'import ast, sys; ast.parse(open(sys.argv[1]).read())' "$SRC_DIR/wg-stats.py" \
    || die "wg-stats.py doesn't look like valid Python"
  grep -q '^\[Service\]' "$SRC_DIR/wg-stats.service" || die "wg-stats.service doesn't look like a systemd unit"
}

install_files() {
  local iface="$1" unit_tmp
  install -d -m 0755 "$(dirname "$BIN_PATH")" "$(dirname "$UNIT_PATH")"
  install -m 0755 "$SRC_DIR/wg-stats.py" "$BIN_PATH"
  unit_tmp=$(mktemp)
  sed -e "s|^ExecStart=.*|ExecStart=$PYTHON $BIN_PATH|" \
      -e "s|wg-quick@wg0\.service|wg-quick@$iface.service|g" \
      "$SRC_DIR/wg-stats.service" >"$unit_tmp"
  install -m 0644 "$unit_tmp" "$UNIT_PATH"
  rm -f "$unit_tmp"
  info "Installed $BIN_PATH and $UNIT_PATH"
}

# ---------------------------------------------------------------- settings

write_env() {
  local tmp
  install -d -m 0755 "$(dirname "$ENV_FILE")"
  tmp=$(umask 077 && mktemp "$ENV_FILE.XXXXXX")
  {
    echo "# wg-stats settings, written by install.sh."
    echo "# After editing, run: sudo systemctl restart $SERVICE"
    echo "WG_STATS_INTERFACE=$IFACE"
    echo "WG_STATS_LISTEN=$LISTEN"
    echo "WG_STATS_PORT=$PORT"
    if [ -n "$TOKEN" ]; then echo "WG_STATS_TOKEN=$TOKEN"; fi
  } >"$tmp"
  chmod 0600 "$tmp"
  mv -f "$tmp" "$ENV_FILE"
  info "Saved settings to $ENV_FILE (readable by root only)"
}

choose_settings() {
  local ifaces count first default_iface default_listen lan_ip had_env=0
  if [ -f "$ENV_FILE" ]; then had_env=1; fi

  # Interface
  if [ -z "$IFACE" ]; then
    ifaces=$(wg show interfaces 2>/dev/null || true)
    # shellcheck disable=SC2086 # split the space-separated list on purpose
    count=$(printf '%s\n' $ifaces | grep -c . || true)
    # shellcheck disable=SC2086
    first=$(printf '%s\n' $ifaces | head -n 1)
    default_iface=$(env_get WG_STATS_INTERFACE)
    default_iface="${default_iface:-${first:-wg0}}"
    if [ "$count" = 0 ]; then
      warn "no running WireGuard interface found; is the tunnel up?"
    elif [ "$count" -gt 1 ]; then
      info "WireGuard interfaces found: $ifaces"
    fi
    if [ "$count" = 1 ] && [ "$had_env" = 0 ]; then
      IFACE="$first"
      info "Using WireGuard interface $IFACE"
    else
      IFACE=$(ask "WireGuard interface" "$default_iface")
    fi
  fi
  valid_iface "$IFACE" || die "invalid interface name: $IFACE"

  # Listen address
  if [ -z "$LISTEN" ]; then
    lan_ip=$(detect_lan_ip)
    default_listen=$(env_get WG_STATS_LISTEN)
    default_listen="${default_listen:-${lan_ip:-0.0.0.0}}"
    if can_prompt; then
      echo "Which address should wg-stats listen on?" >/dev/tty
      echo "  your LAN IP (${lan_ip:-not detected}) - Home Assistant is on another machine" >/dev/tty
      echo "  127.0.0.1   - Home Assistant runs on this machine" >/dev/tty
      echo "  0.0.0.0     - every interface (not recommended)" >/dev/tty
    fi
    LISTEN=$(ask "Listen address" "$default_listen")
  fi
  valid_listen "$LISTEN" || die "invalid listen address: $LISTEN"
  if [ "$LISTEN" = "0.0.0.0" ] || [ "$LISTEN" = "::" ]; then
    warn "listening on every interface; restrict port access with a firewall"
  fi

  # Port
  if [ -z "$PORT" ]; then
    PORT=$(env_get WG_STATS_PORT)
    PORT=$(ask "Port" "${PORT:-8888}")
  fi
  valid_port "$PORT" || die "invalid port: $PORT"
  # A busy port is fine only when it's wg-stats itself on its current port.
  if port_in_use "$PORT" && ! { [ "$PORT" = "$(env_get WG_STATS_PORT)" ] \
       && systemctl is-active --quiet "$SERVICE" 2>/dev/null; }; then
    warn "port $PORT is already in use by another program"
    confirm "Continue anyway?" n || die "aborted; choose another port with --port"
  fi

  # Token
  TOKEN=""
  if [ "$NO_TOKEN" = 1 ]; then
    warn "no access token: anyone who can reach port $PORT can read your peer list"
  else
    TOKEN=$(env_get WG_STATS_TOKEN)
    if [ -n "$GIVEN_TOKEN" ]; then
      if [ "$GIVEN_TOKEN" = "$TOKEN" ]; then
        info "Keeping the existing access token"
      else
        TOKEN="$GIVEN_TOKEN"
        info "Using the access token from --token"
      fi
    elif [ -n "$TOKEN" ] && [ "$NEW_TOKEN" = 0 ]; then
      info "Keeping the existing access token"
    elif [ "$had_env" = 1 ] && [ -z "$TOKEN" ] && [ "$NEW_TOKEN" = 0 ] \
         && ! { can_prompt && confirm "No access token is set. Create one now?" y; }; then
      # Existing install without a token: adding one unasked would break the
      # Home Assistant sensor, so only do it when the user agrees.
      warn "keeping the existing setup without an access token (use --new-token to add one)"
    else
      TOKEN=$("$PYTHON" -c 'import secrets; print(secrets.token_urlsafe(32))')
      info "Generated a new access token"
    fi
  fi
}

# ---------------------------------------------------------------- service

# Exit 0: OK (prints peer counts), 2: API reports an error, 3: token rejected,
# anything else: not reachable yet.
HEALTH_CHECK_PY='
import json, os, sys, urllib.error, urllib.request
req = urllib.request.Request(sys.argv[1])
token = os.environ.get("WG_STATS_CHECK_TOKEN")
if token:
    req.add_header("Authorization", "Bearer " + token)
try:
    with urllib.request.urlopen(req, timeout=3) as resp:
        data = json.load(resp)
except urllib.error.HTTPError as e:
    sys.exit(3 if e.code == 401 else 1)
if data.get("error"):
    print(data["error"])
    sys.exit(2)
print("%s of %s peers online" % (data.get("active_peers", 0), data.get("total_peers", 0)))
'

restart_service() {
  systemctl daemon-reload
  systemctl enable "$SERVICE" >/dev/null 2>&1 || systemctl enable "$SERVICE"
  systemctl restart "$SERVICE"
}

health_check() {
  local host="$LISTEN" url result=""
  case "$host" in
    0.0.0.0) host="127.0.0.1" ;;
    ::) host="::1" ;;
  esac
  case "$host" in *:*) host="[$host]" ;; esac
  url="http://$host:$PORT/"
  local status=0
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    # The token goes through the environment, not argv, so it doesn't show up in `ps`.
    status=0
    result=$(WG_STATS_CHECK_TOKEN="$TOKEN" "$PYTHON" -I -c "$HEALTH_CHECK_PY" "$url" 2>/dev/null) || status=$?
    if [ "$status" = 0 ]; then
      info "wg-stats is running on $url ($result)"
      return 0
    elif [ "$status" = 2 ]; then
      warn "wg-stats is running but reports: $result"
      warn "check the interface name and: sudo journalctl -u $SERVICE -n 20"
      return 0
    elif [ "$status" = 3 ]; then
      warn "wg-stats rejected the access token (HTTP 401)"
      return 1
    fi
    sleep 0.5
  done
  warn "wg-stats didn't answer on $url"
  warn "check: sudo systemctl status $SERVICE   and   sudo journalctl -u $SERVICE -n 20"
  return 1
}

print_ha_config() {
  local host="$LISTEN" lan_ip
  case "$host" in
    0.0.0.0|::) lan_ip=$(detect_lan_ip); host="${lan_ip:-<this-machine-ip>}" ;;
  esac
  case "$host" in *:*) host="[$host]" ;; esac

  echo
  echo "${C_BOLD}Add this to Home Assistant's configuration.yaml:${C_OFF}"
  echo
  cat <<EOF
sensor:
  - platform: rest
    name: vpn_stats
    unique_id: wireguard_vpn_stats
    resource: http://$host:$PORT
EOF
  if [ -n "$TOKEN" ]; then
    cat <<'EOF'
    headers:
      Authorization: !secret wg_stats_auth
EOF
  fi
  cat <<'EOF'
    scan_interval: 10
    value_template: "{{ value_json.active_peers }}"
    unit_of_measurement: peers
    json_attributes:
      - active_peers
      - total_peers
      - peers
      - updated_at
      - error
EOF
  if [ -n "$TOKEN" ]; then
    echo
    echo "${C_BOLD}And this to secrets.yaml:${C_OFF}"
    echo
    echo "wg_stats_auth: \"Bearer $TOKEN\""
  fi
  echo
  case "$LISTEN" in
    127.*|::1)
      echo "Listening on loopback only: Home Assistant must run on this machine"
      echo "(in Docker, with network_mode: host)." ;;
    *)
      echo "Tip: allow only your Home Assistant host to reach port $PORT, e.g. with ufw:"
      echo "  sudo ufw allow from <home-assistant-ip> to any port $PORT proto tcp" ;;
  esac
  echo "Settings live in $ENV_FILE. Re-run this installer to change them."
}

# ---------------------------------------------------------------- commands

do_install() {
  preflight
  get_sources
  choose_settings
  install_files "$IFACE"
  write_env
  restart_service
  health_check || true
  print_ha_config
}

do_upgrade() {
  preflight
  [ -f "$UNIT_PATH" ] || [ -f "$ENV_FILE" ] || die "wg-stats isn't installed; run: sudo $0 install"
  get_sources
  local iface
  iface=$(env_get WG_STATS_INTERFACE)
  install_files "${iface:-wg0}"
  restart_service
  LISTEN=$(env_get WG_STATS_LISTEN) PORT=$(env_get WG_STATS_PORT) TOKEN=$(env_get WG_STATS_TOKEN)
  LISTEN="${LISTEN:-0.0.0.0}" PORT="${PORT:-8888}"
  health_check || true
  info "Upgrade done; settings in $ENV_FILE were kept"
}

do_uninstall() {
  preflight
  confirm "Stop and remove the $SERVICE service?" y || die "aborted"
  systemctl disable --now "$SERVICE" >/dev/null 2>&1 || true
  rm -f "$UNIT_PATH" "$BIN_PATH"
  systemctl daemon-reload
  info "Removed $UNIT_PATH and $BIN_PATH"
  if [ -f "$ENV_FILE" ]; then
    if [ "$PURGE" = 1 ]; then
      rm -f "$ENV_FILE"
      info "Removed $ENV_FILE"
    else
      info "Kept $ENV_FILE (delete it, or use --purge, to remove the settings and token)"
    fi
  fi
}

case "$CMD" in
  install)   do_install ;;
  upgrade)   do_upgrade ;;
  uninstall) do_uninstall ;;
esac
