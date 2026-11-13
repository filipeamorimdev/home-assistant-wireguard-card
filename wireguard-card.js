const WG_CARD_VERSION = '1.1.0';

const WG_TRANSLATIONS = {
  en: {
    entity_not_found: 'Entity not found',
    api_error: 'API error',
    status_online: 'online',
    status_offline: 'offline',
    meta_endpoint: 'endpoint',
    meta_allowed_ips: 'allowed IPs',
    meta_last_handshake: 'last handshake',
    meta_never: 'never',
    meta_online_for: 'online for',
    transfer_rx: 'rx',
    transfer_tx: 'tx',
    title: 'WireGuard VPN',
    subtitle: 'peer status',
    stat_active_peers: 'active peers',
    updated: 'updated',
    editor_sensor_entity: 'Sensor entity',
    editor_select_sensor: '— select a sensor —',
    editor_title: 'Card title',
    editor_title_hint: 'Leave empty to use the default',
    editor_connected_only: 'Connected only',
    editor_connected_only_hint: 'Hide offline peers from the card',
    editor_language: 'Language',
    editor_language_auto: 'Auto (Home Assistant language)',
    editor_setup_title: 'Set up the stats API',
    editor_setup_intro: 'Create an access key here, then install wg-stats on your WireGuard server with it.',
    editor_setup_generate: 'Generate access key',
    editor_setup_regenerate: 'Generate a new key',
    editor_setup_step_install: '1. Run on the WireGuard server:',
    editor_setup_step_secret: "2. Add to Home Assistant's secrets.yaml:",
    editor_setup_step_sensor: '3. Paste the sensor configuration the installer prints into configuration.yaml and restart Home Assistant.',
    editor_setup_copy: 'Copy',
    editor_setup_copied: 'Copied',
    editor_setup_not_saved: "The key isn't saved in the card. Keep it only in secrets.yaml.",
  },
  pt: {
    entity_not_found: 'Entidade não encontrada',
    api_error: 'Erro da API',
    status_online: 'online',
    status_offline: 'offline',
    meta_endpoint: 'endpoint',
    meta_allowed_ips: 'IPs permitidos',
    meta_last_handshake: 'último handshake',
    meta_never: 'nunca',
    meta_online_for: 'online há',
    transfer_rx: 'rx',
    transfer_tx: 'tx',
    title: 'WireGuard VPN',
    subtitle: 'estado dos peers',
    stat_active_peers: 'peers ativos',
    updated: 'atualizado',
    editor_sensor_entity: 'Entidade do sensor',
    editor_select_sensor: '— selecione um sensor —',
    editor_title: 'Título do cartão',
    editor_title_hint: 'Deixe vazio para usar o padrão',
    editor_connected_only: 'Apenas conectados',
    editor_connected_only_hint: 'Ocultar peers desconectados do cartão',
    editor_language: 'Idioma',
    editor_language_auto: 'Automático (idioma do Home Assistant)',
    editor_setup_title: 'Configurar a API de estatísticas',
    editor_setup_intro: 'Crie aqui uma chave de acesso e instale o wg-stats com ela no servidor WireGuard.',
    editor_setup_generate: 'Gerar chave de acesso',
    editor_setup_regenerate: 'Gerar nova chave',
    editor_setup_step_install: '1. Execute no servidor WireGuard:',
    editor_setup_step_secret: '2. Adicione ao secrets.yaml do Home Assistant:',
    editor_setup_step_sensor: '3. Cole no configuration.yaml a configuração do sensor que o instalador mostra e reinicie o Home Assistant.',
    editor_setup_copy: 'Copiar',
    editor_setup_copied: 'Copiado',
    editor_setup_not_saved: 'A chave não fica guardada no cartão. Guarde-a apenas no secrets.yaml.',
  },
  es: {
    entity_not_found: 'Entidad no encontrada',
    api_error: 'Error de la API',
    status_online: 'en línea',
    status_offline: 'desconectado',
    meta_endpoint: 'endpoint',
    meta_allowed_ips: 'IPs permitidas',
    meta_last_handshake: 'último handshake',
    meta_never: 'nunca',
    meta_online_for: 'en línea desde hace',
    transfer_rx: 'rx',
    transfer_tx: 'tx',
    title: 'WireGuard VPN',
    subtitle: 'estado de los peers',
    stat_active_peers: 'peers activos',
    updated: 'actualizado',
    editor_sensor_entity: 'Entidad del sensor',
    editor_select_sensor: '— selecciona un sensor —',
    editor_title: 'Título de la tarjeta',
    editor_title_hint: 'Déjalo vacío para usar el predeterminado',
    editor_connected_only: 'Solo conectados',
    editor_connected_only_hint: 'Ocultar los peers desconectados de la tarjeta',
    editor_language: 'Idioma',
    editor_language_auto: 'Automático (idioma de Home Assistant)',
    editor_setup_title: 'Configurar la API de estadísticas',
    editor_setup_intro: 'Crea aquí una clave de acceso e instala wg-stats con ella en tu servidor WireGuard.',
    editor_setup_generate: 'Generar clave de acceso',
    editor_setup_regenerate: 'Generar una clave nueva',
    editor_setup_step_install: '1. Ejecuta en el servidor WireGuard:',
    editor_setup_step_secret: '2. Añade a secrets.yaml de Home Assistant:',
    editor_setup_step_sensor: '3. Pega en configuration.yaml la configuración del sensor que muestra el instalador y reinicia Home Assistant.',
    editor_setup_copy: 'Copiar',
    editor_setup_copied: 'Copiado',
    editor_setup_not_saved: 'La clave no se guarda en la tarjeta. Guárdala solo en secrets.yaml.',
  },
  fr: {
    entity_not_found: 'Entité introuvable',
    api_error: "Erreur de l'API",
    status_online: 'en ligne',
    status_offline: 'hors ligne',
    meta_endpoint: 'endpoint',
    meta_allowed_ips: 'IPs autorisées',
    meta_last_handshake: 'dernier handshake',
    meta_never: 'jamais',
    meta_online_for: 'en ligne depuis',
    transfer_rx: 'rx',
    transfer_tx: 'tx',
    title: 'WireGuard VPN',
    subtitle: 'état des pairs',
    stat_active_peers: 'pairs actifs',
    updated: 'mis à jour',
    editor_sensor_entity: 'Entité du capteur',
    editor_select_sensor: '— sélectionnez un capteur —',
    editor_title: 'Titre de la carte',
    editor_title_hint: 'Laissez vide pour utiliser la valeur par défaut',
    editor_connected_only: 'Connectés uniquement',
    editor_connected_only_hint: 'Masquer les pairs hors ligne de la carte',
    editor_language: 'Langue',
    editor_language_auto: 'Auto (langue de Home Assistant)',
    editor_setup_title: "Configurer l'API de statistiques",
    editor_setup_intro: "Créez ici une clé d'accès, puis installez wg-stats avec cette clé sur votre serveur WireGuard.",
    editor_setup_generate: "Générer une clé d'accès",
    editor_setup_regenerate: 'Générer une nouvelle clé',
    editor_setup_step_install: '1. Exécutez sur le serveur WireGuard :',
    editor_setup_step_secret: '2. Ajoutez au secrets.yaml de Home Assistant :',
    editor_setup_step_sensor: "3. Collez dans configuration.yaml la configuration du capteur affichée par l'installateur, puis redémarrez Home Assistant.",
    editor_setup_copy: 'Copier',
    editor_setup_copied: 'Copié',
    editor_setup_not_saved: "La clé n'est pas enregistrée dans la carte. Conservez-la uniquement dans secrets.yaml.",
  },
  de: {
    entity_not_found: 'Entität nicht gefunden',
    api_error: 'API-Fehler',
    status_online: 'online',
    status_offline: 'offline',
    meta_endpoint: 'Endpunkt',
    meta_allowed_ips: 'Erlaubte IPs',
    meta_last_handshake: 'Letzter Handshake',
    meta_never: 'nie',
    meta_online_for: 'Online seit',
    transfer_rx: 'rx',
    transfer_tx: 'tx',
    title: 'WireGuard VPN',
    subtitle: 'Peer-Status',
    stat_active_peers: 'Aktive Peers',
    updated: 'Aktualisiert',
    editor_sensor_entity: 'Sensor-Entität',
    editor_select_sensor: '— Sensor auswählen —',
    editor_title: 'Kartentitel',
    editor_title_hint: 'Leer lassen, um den Standard zu verwenden',
    editor_connected_only: 'Nur verbundene',
    editor_connected_only_hint: 'Offline-Peers ausblenden',
    editor_language: 'Sprache',
    editor_language_auto: 'Automatisch (Home Assistant Sprache)',
    editor_setup_title: 'Statistik-API einrichten',
    editor_setup_intro: 'Erstellen Sie hier einen Zugriffsschlüssel und installieren Sie damit wg-stats auf Ihrem WireGuard-Server.',
    editor_setup_generate: 'Zugriffsschlüssel erzeugen',
    editor_setup_regenerate: 'Neuen Schlüssel erzeugen',
    editor_setup_step_install: '1. Auf dem WireGuard-Server ausführen:',
    editor_setup_step_secret: '2. In die secrets.yaml von Home Assistant eintragen:',
    editor_setup_step_sensor: '3. Die vom Installer ausgegebene Sensor-Konfiguration in die configuration.yaml einfügen und Home Assistant neu starten.',
    editor_setup_copy: 'Kopieren',
    editor_setup_copied: 'Kopiert',
    editor_setup_not_saved: 'Der Schlüssel wird nicht in der Karte gespeichert. Bewahren Sie ihn nur in der secrets.yaml auf.',
  },
};

const WG_LANG_NAMES = {
  en: 'English',
  pt: 'Português',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

function wgResolveLanguage(config, hass) {
  const explicit = config && config.language;
  if (explicit && WG_TRANSLATIONS[explicit]) return explicit;
  const fromHass =
    (hass && hass.locale && hass.locale.language) ||
    (hass && hass.language) ||
    'en';
  const short = String(fromHass).toLowerCase().split('-')[0];
  return WG_TRANSLATIONS[short] ? short : 'en';
}

function wgT(lang, key) {
  return (WG_TRANSLATIONS[lang] && WG_TRANSLATIONS[lang][key]) ||
    WG_TRANSLATIONS.en[key] ||
    key;
}

// Random access key for the stats API: 32 bytes, base64url, the same shape
// as Python's secrets.token_urlsafe(32). getRandomValues also works on
// plain-HTTP Home Assistant installs, unlike crypto.randomUUID.
function wgGenerateToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const WG_REPO_URL = 'https://github.com/filipeamorimdev/home-assistant-wireguard-card';

// Escape user/API-derived values before interpolating them into innerHTML.
// Safe for both element-text and double-quoted-attribute contexts.
function wgEscapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const WG_BYTE_UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];

// Binary units like `wg show`, with the number formatted for the language
// (e.g. "1.50 GiB" in English, "1,50 GiB" in Portuguese).
function wgFormatBytes(bytes, lang, digits = 2) {
  let value = Number(bytes);
  let unit = 0;
  while (Math.abs(value) >= 1024 && unit < WG_BYTE_UNITS.length - 1) {
    value /= 1024;
    unit++;
  }
  const fraction = unit === 0 ? 0 : digits;
  const number = new Intl.NumberFormat(lang, {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  }).format(value);
  return `${number} ${WG_BYTE_UNITS[unit]}`;
}

// "now", "12 seconds ago", "5 minutes ago"… in the card's language.
function wgRelativeTime(seconds, lang) {
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
  if (seconds < 60) return rtf.format(-seconds, 'second');
  if (seconds < 3600) return rtf.format(-Math.floor(seconds / 60), 'minute');
  if (seconds < 86400) return rtf.format(-Math.floor(seconds / 3600), 'hour');
  if (seconds < 365 * 86400) return rtf.format(-Math.floor(seconds / 86400), 'day');
  return rtf.format(-Math.floor(seconds / (365 * 86400)), 'year');
}

// Two largest units, e.g. "1 hr 5 min", "45 sec".
function wgDuration(seconds, lang) {
  const units = [['day', 86400], ['hour', 3600], ['minute', 60], ['second', 1]];
  const parts = [];
  for (const [unit, size] of units) {
    const value = Math.floor(seconds / size);
    seconds -= value * size;
    if (value || (unit === 'second' && !parts.length)) {
      parts.push(new Intl.NumberFormat(lang, { style: 'unit', unit, unitDisplay: 'short' }).format(value));
    }
    if (parts.length === 2) break;
  }
  return parts.join(' ');
}

// Epoch milliseconds from an ISO timestamp, or null when missing/invalid.
function wgParseTime(value) {
  const ms = value ? Date.parse(value) : NaN;
  return Number.isFinite(ms) ? ms : null;
}

class WireguardCard extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    const hass = this._hass;
    if (!hass || !this._config) return;
    const lang = wgResolveLanguage(this._config, hass);
    const entity = hass.states[this._config.entity];
    // hass is replaced on every state change in the instance; only rebuild
    // when our sensor, the language or the config (reset in setConfig) changed.
    if (this._rendered && entity === this._lastEntity && lang === this._lastLang) return;
    this._rendered = true;
    this._lastEntity = entity;
    this._lastLang = lang;
    if (!entity) {
      this.innerHTML = `<ha-card><div style="padding:1rem;color:var(--error-color)">${wgT(lang, 'entity_not_found')}: ${wgEscapeHtml(this._config.entity)}</div></ha-card>`;
      return;
    }
    const attrs = entity.attributes;
    // Guard against a malformed attribute (string/array) from a misconfigured API.
    const peers = attrs.peers && typeof attrs.peers === 'object' && !Array.isArray(attrs.peers) ? attrs.peers : {};
    // Fall back to the sensor state only when it is numeric — otherwise
    // an unavailable sensor would render "unavailable / 0".
    const stateCount = Number.isFinite(Number(entity.state)) ? entity.state : '—';
    const activePeers = attrs.active_peers ?? stateCount;
    const totalPeers = attrs.total_peers ?? Object.keys(peers).length;
    const updatedAt = attrs.updated_at ? new Date(attrs.updated_at).toLocaleString(lang) : '';

    const connectedOnly = this._config.connected_only === true;
    const visiblePeers = Object.values(peers)
      .filter(p => p && typeof p === 'object')
      .filter(p => !connectedOnly || p.connected === true);

    // Prefer raw values (formatted here, in the card's language) and fall back
    // to the API's preformatted text for older or custom servers.
    const bytesText = (bytes, text) =>
      typeof bytes === 'number' ? wgFormatBytes(bytes, lang) : (text ?? '');
    const rateText = (rate, online) =>
      online && typeof rate === 'number'
        ? `<span class="wg-tx-rate">${wgEscapeHtml(wgFormatBytes(rate, lang, 1))}/s</span>`
        : '';

    const peerRows = visiblePeers.map(p => {
      const online = p.connected === true;
      // Times are filled in (and kept ticking) by _tick().
      const handshakeAt = wgParseTime(p.latest_handshake_at);
      const handshake = handshakeAt !== null
        ? `<span class="wg-meta-val wg-meta-val--${online ? 'good' : 'muted'}" data-wg-ago="${handshakeAt}"></span>`
        : `<span class="wg-meta-val wg-meta-val--${online ? 'good' : 'muted'}">${wgEscapeHtml(p.latest_handshake ?? wgT(lang, 'meta_never'))}</span>`;
      const since = online ? wgParseTime(p.connected_since) : null;
      const onlineFor = since !== null ? `
            <div class="wg-meta-item">
              <span class="wg-meta-label">${wgT(lang, 'meta_online_for')}</span>
              <span class="wg-meta-val" data-wg-since="${since}"></span>
            </div>` : '';
      return `
        <div class="wg-peer ${online ? 'wg-peer--online' : 'wg-peer--offline'}">
          <div class="wg-peer-header">
            <span class="wg-dot ${online ? 'wg-dot--on' : 'wg-dot--off'}"></span>
            <span class="wg-peer-name">${wgEscapeHtml(p.friendly_name ?? '')}</span>
            <span class="wg-badge ${online ? 'wg-badge--on' : 'wg-badge--off'}">${online ? wgT(lang, 'status_online') : wgT(lang, 'status_offline')}</span>
          </div>
          <div class="wg-peer-meta">
            <div class="wg-meta-item">
              <span class="wg-meta-label">${wgT(lang, 'meta_endpoint')}</span>
              <span class="wg-meta-val">${wgEscapeHtml(p.endpoint ?? '')}</span>
            </div>
            <div class="wg-meta-item">
              <span class="wg-meta-label">${wgT(lang, 'meta_allowed_ips')}</span>
              <span class="wg-meta-val">${wgEscapeHtml(p.allowed_ips ?? '')}</span>
            </div>
            <div class="wg-meta-item">
              <span class="wg-meta-label">${wgT(lang, 'meta_last_handshake')}</span>
              ${handshake}
            </div>${onlineFor}
          </div>
          <div class="wg-transfer">
            <div class="wg-transfer-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
              <span class="wg-tx-label">${wgT(lang, 'transfer_rx')}</span>
              <span class="wg-tx-val">${wgEscapeHtml(bytesText(p.transfer_rx_bytes, p.transfer_rx_human))}</span>
              ${rateText(p.rx_rate, online)}
            </div>
            <div class="wg-transfer-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
              <span class="wg-tx-label">${wgT(lang, 'transfer_tx')}</span>
              <span class="wg-tx-val">${wgEscapeHtml(bytesText(p.transfer_tx_bytes, p.transfer_tx_human))}</span>
              ${rateText(p.tx_rate, online)}
            </div>
          </div>
        </div>`;
    }).join('');

    this.innerHTML = `
      <ha-card>
        <style>
          .wg-root { padding: 16px 16px 12px; font-family: var(--primary-font-family, sans-serif); }
          .wg-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
          .wg-header .wg-stat { margin-left: auto; text-align: right; background: var(--secondary-background-color); border-radius: 8px; padding: 8px 12px; min-width: 80px; }
          .wg-icon { color: var(--secondary-text-color); }
          .wg-title { font-size: 15px; font-weight: 500; color: var(--primary-text-color); margin: 0; }
          .wg-sub { font-size: 12px; color: var(--secondary-text-color); margin: 0; }
          .wg-stat { background: var(--secondary-background-color); border-radius: 8px; padding: 10px 12px; }
          .wg-stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: var(--secondary-text-color); margin: 0 0 2px; }
          .wg-stat-val { font-size: 20px; font-weight: 500; color: var(--primary-text-color); margin: 0; }
          .wg-stat-val span { font-size: 13px; color: var(--secondary-text-color); }
          .wg-peer { border: 1px solid var(--divider-color); border-radius: 8px; padding: 12px; margin-bottom: 8px; }
          .wg-peer:last-child { margin-bottom: 0; }
          .wg-peer-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
          .wg-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
          .wg-dot--on { background: var(--success-color, #22c55e); }
          .wg-dot--off { background: var(--disabled-text-color, #94a3b8); }
          .wg-peer-name { font-size: 13px; font-weight: 500; color: var(--primary-text-color); flex: 1; }
          .wg-badge { font-size: 10px; padding: 2px 8px; border-radius: 6px; font-weight: 500; }
          .wg-badge--on { background: var(--success-color, #22c55e); color: #fff; opacity: .85; }
          .wg-badge--off { background: var(--secondary-background-color); color: var(--secondary-text-color); }
          .wg-peer-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 12px; }
          .wg-meta-item { display: flex; flex-direction: column; gap: 1px; }
          .wg-meta-label { font-size: 10px; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: .04em; }
          .wg-meta-val { font-size: 11px; color: var(--primary-text-color); font-family: var(--code-font-family, monospace); word-break: break-all; }
          .wg-meta-val--good { color: var(--success-color, #22c55e); }
          .wg-meta-val--muted { color: var(--secondary-text-color); }
          .wg-transfer { display: flex; gap: 14px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--divider-color); }
          .wg-transfer-item { display: flex; align-items: center; gap: 5px; color: var(--secondary-text-color); }
          .wg-tx-label { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: var(--secondary-text-color); }
          .wg-tx-val { font-size: 12px; font-weight: 500; color: var(--primary-text-color); }
          .wg-tx-rate { font-size: 11px; color: var(--secondary-text-color); }
          .wg-error { font-size: 12px; color: var(--error-color, #db4437); background: var(--secondary-background-color); border-radius: 8px; padding: 8px 12px; margin-bottom: 8px; word-break: break-word; }
          .wg-updated { font-size: 10px; color: var(--secondary-text-color); text-align: right; margin-top: 10px; }
        </style>
        <div class="wg-root">
          <div class="wg-header">
            <svg class="wg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <div>
              <p class="wg-title">${wgEscapeHtml(this._config.title || wgT(lang, 'title'))}</p>
              <p class="wg-sub">${wgT(lang, 'subtitle')}</p>
            </div>
            <div class="wg-stat">
              <p class="wg-stat-label">${wgT(lang, 'stat_active_peers')}</p>
              <p class="wg-stat-val">${wgEscapeHtml(activePeers)} <span>/ ${wgEscapeHtml(totalPeers)}</span></p>
            </div>
          </div>
          ${attrs.error ? `<div class="wg-error">${wgT(lang, 'api_error')}: ${wgEscapeHtml(attrs.error)}</div>` : ''}
          <div class="wg-peers">${peerRows}</div>
          ${updatedAt ? `<div class="wg-updated">${wgT(lang, 'updated')} ${updatedAt}</div>` : ''}
        </div>
      </ha-card>`;
    this._tick();
  }

  // Keep "x seconds ago" / "online for" current between sensor updates by
  // rewriting only those text nodes, not the whole card.
  connectedCallback() {
    if (!this._ticker) this._ticker = setInterval(() => this._tick(), 1000);
  }

  disconnectedCallback() {
    clearInterval(this._ticker);
    this._ticker = null;
  }

  _tick() {
    const lang = this._lastLang;
    if (!lang || document.hidden) return;
    const now = Date.now();
    // Clamp at 0 in case the browser's clock is slightly behind the server's.
    const elapsed = el => Math.max(0, Math.floor((now - Number(el.dataset.wgAgo ?? el.dataset.wgSince)) / 1000));
    this.querySelectorAll('[data-wg-ago]').forEach(el => {
      const text = wgRelativeTime(elapsed(el), lang);
      if (el.textContent !== text) el.textContent = text;
    });
    this.querySelectorAll('[data-wg-since]').forEach(el => {
      const text = wgDuration(elapsed(el), lang);
      if (el.textContent !== text) el.textContent = text;
    });
  }

  setConfig(config) {
    if (!config.entity) throw new Error('Please define an entity');
    this._config = config;
    this._rendered = false;
    this._render();
  }

  getCardSize() { return 4; }

  static getConfigElement() {
    return document.createElement('wireguard-card-editor');
  }

  static getStubConfig(hass) {
    // Pre-select the first sensor exposing a `peers` attribute, falling back
    // to one whose id looks like a vpn_stats sensor.
    const sensors = Object.keys(hass.states).filter(e => e.startsWith('sensor.'));
    const guess =
      sensors.find(e => {
        const peers = hass.states[e].attributes.peers;
        return peers && typeof peers === 'object';
      }) ||
      sensors.find(e => e.includes('vpn')) ||
      '';
    return { entity: guess };
  }
}

class WireguardCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    if (!this._built) {
      this._render();
      return;
    }
    // Re-render only when the resolved language changes — a discrete user
    // action — so the editor labels reflect the new language. All other
    // setConfig calls (toggle, sensor change, hass updates) just sync values
    // in-place to preserve focus. Compare against the language the labels
    // were rendered in: the change handlers update this._config before
    // dispatching, so the previous config can't be used for the comparison.
    if (this._renderedLang !== wgResolveLanguage(config, this._hass)) {
      this._built = false;
      this._render();
      return;
    }
    this._syncValues();
  }

  set hass(hass) {
    const wasSet = !!this._hass;
    this._hass = hass;
    // Build the editor exactly once, as soon as both hass and config are available.
    // Avoid re-rendering on subsequent hass updates so inputs don't lose focus
    // and the sensor dropdown doesn't snap closed mid-interaction.
    if (!this._built && !wasSet) {
      this._render();
    }
  }

  _render() {
    if (!this._hass || !this._config) return;

    const lang = wgResolveLanguage(this._config, this._hass);

    const sensors = Object.keys(this._hass.states)
      .filter(e => e.startsWith('sensor.'))
      .sort();

    const options = sensors.map(e => {
      const label = this._hass.states[e].attributes.friendly_name || e;
      const selected = e === this._config.entity ? 'selected' : '';
      return `<option value="${wgEscapeHtml(e)}" ${selected}>${wgEscapeHtml(label)} (${wgEscapeHtml(e)})</option>`;
    }).join('');

    const languageOptions = Object.keys(WG_LANG_NAMES).map(code => {
      const selected = this._config.language === code ? 'selected' : '';
      return `<option value="${code}" ${selected}>${WG_LANG_NAMES[code]}</option>`;
    }).join('');

    const titleValue = wgEscapeHtml(this._config.title || '');
    const titlePlaceholder = wgEscapeHtml(wgT(lang, 'title'));

    const connectedOnly = this._config.connected_only === true;

    this.innerHTML = `
      <style>
        .wg-editor { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
        .wg-editor label { font-size: 12px; color: var(--secondary-text-color); display: block; margin-bottom: 4px; }
        .wg-editor select,
        .wg-editor input[type="text"] {
          width: 100%;
          box-sizing: border-box;
          background: var(--card-background-color);
          color: var(--primary-text-color);
          border: 1px solid var(--divider-color);
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 13px;
          font-family: var(--primary-font-family, sans-serif);
        }
        .wg-editor input[type="text"]::placeholder { color: var(--secondary-text-color); opacity: .7; }
        .wg-hint { font-size: 11px; color: var(--secondary-text-color); margin-top: 4px; }
        .wg-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: var(--secondary-background-color);
          border-radius: 8px;
        }
        .wg-toggle-label { font-size: 13px; color: var(--primary-text-color); }
        .wg-toggle-sub { font-size: 11px; color: var(--secondary-text-color); margin-top: 2px; }
        .wg-switch { position: relative; width: 36px; height: 20px; flex-shrink: 0; }
        .wg-switch input { opacity: 0; width: 0; height: 0; }
        .wg-slider {
          position: absolute; inset: 0;
          background: var(--divider-color);
          border-radius: 20px;
          cursor: pointer;
          transition: background .2s;
        }
        .wg-slider::before {
          content: '';
          position: absolute;
          width: 14px; height: 14px;
          left: 3px; top: 3px;
          background: #fff;
          border-radius: 50%;
          transition: transform .2s;
        }
        .wg-switch input:checked + .wg-slider { background: var(--primary-color, #3b82f6); }
        .wg-switch input:checked + .wg-slider::before { transform: translateX(16px); }
        .wg-setup { border-top: 1px solid var(--divider-color); padding-top: 12px; }
        .wg-setup summary { cursor: pointer; font-size: 13px; color: var(--primary-text-color); }
        .wg-setup-body { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; font-size: 12px; color: var(--secondary-text-color); }
        .wg-setup-body p { margin: 0; }
        .wg-code-row { display: flex; gap: 6px; align-items: stretch; }
        .wg-code {
          flex: 1; min-width: 0; margin: 0;
          padding: 8px 10px;
          background: var(--secondary-background-color);
          color: var(--primary-text-color);
          border-radius: 6px;
          font-family: var(--code-font-family, monospace);
          font-size: 11px;
          white-space: pre-wrap; word-break: break-all;
          user-select: all;
        }
        .wg-button {
          background: var(--primary-color, #3b82f6);
          color: var(--text-primary-color, #fff);
          border: none; border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px; cursor: pointer;
          align-self: flex-start;
        }
        .wg-button.secondary {
          background: transparent;
          color: var(--primary-color, #3b82f6);
          border: 1px solid var(--divider-color);
        }
      </style>
      <div class="wg-editor">
        <div>
          <label>${wgT(lang, 'editor_sensor_entity')}</label>
          <select id="entity-picker">
            <option value="" disabled ${!this._config.entity ? 'selected' : ''}>${wgT(lang, 'editor_select_sensor')}</option>
            ${options}
          </select>
        </div>
        <div>
          <label>${wgT(lang, 'editor_title')}</label>
          <input type="text" id="title-input" value="${titleValue}" placeholder="${titlePlaceholder}">
          <div class="wg-hint">${wgT(lang, 'editor_title_hint')}</div>
        </div>
        <div class="wg-toggle-row">
          <div>
            <div class="wg-toggle-label">${wgT(lang, 'editor_connected_only')}</div>
            <div class="wg-toggle-sub">${wgT(lang, 'editor_connected_only_hint')}</div>
          </div>
          <label class="wg-switch">
            <input type="checkbox" id="connected-only" ${connectedOnly ? 'checked' : ''}>
            <span class="wg-slider"></span>
          </label>
        </div>
        <div>
          <label>${wgT(lang, 'editor_language')}</label>
          <select id="language-picker">
            <option value="" ${!this._config.language ? 'selected' : ''}>${wgT(lang, 'editor_language_auto')}</option>
            ${languageOptions}
          </select>
        </div>
        <details class="wg-setup" ${this._setupOpen ? 'open' : ''}>
          <summary>${wgT(lang, 'editor_setup_title')}</summary>
          <div class="wg-setup-body">${this._setupBody(lang)}</div>
        </details>
      </div>`;

    this._built = true;
    this._renderedLang = lang;

    const setup = this.querySelector('.wg-setup');
    setup.addEventListener('toggle', () => { this._setupOpen = setup.open; });
    this._bindSetup(lang);

    this.querySelector('#entity-picker').addEventListener('change', e => {
      this._config = { ...this._config, entity: e.target.value };
      this.dispatchEvent(new CustomEvent('config-changed', {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }));
    });

    this.querySelector('#title-input').addEventListener('input', e => {
      const next = { ...this._config };
      if (e.target.value) {
        next.title = e.target.value;
      } else {
        delete next.title;
      }
      this._config = next;
      this.dispatchEvent(new CustomEvent('config-changed', {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }));
    });

    this.querySelector('#connected-only').addEventListener('change', e => {
      const next = { ...this._config };
      if (e.target.checked) {
        next.connected_only = true;
      } else {
        delete next.connected_only;
      }
      this._config = next;
      this.dispatchEvent(new CustomEvent('config-changed', {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }));
    });

    this.querySelector('#language-picker').addEventListener('change', e => {
      const next = { ...this._config };
      if (e.target.value) {
        next.language = e.target.value;
      } else {
        delete next.language;
      }
      this._config = next;
      this.dispatchEvent(new CustomEvent('config-changed', {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }));
    });
  }

  // The generated key lives only on this editor instance, so it survives the
  // re-render on a language change but is never written to the card config,
  // which every dashboard user can read.
  _setupBody(lang) {
    const t = key => wgT(lang, key);
    if (!this._setupToken) {
      return `
        <p>${t('editor_setup_intro')}</p>
        <button type="button" class="wg-button" id="wg-generate">${t('editor_setup_generate')}</button>`;
    }
    const installUrl = `${WG_REPO_URL}/releases/download/v${WG_CARD_VERSION}/install.sh`;
    const command = `curl -fsSL ${installUrl} | sudo bash -s -- --token ${this._setupToken}`;
    const secret = `wg_stats_auth: "Bearer ${this._setupToken}"`;
    const row = (id, text) => `
      <div class="wg-code-row">
        <pre class="wg-code" id="${id}">${wgEscapeHtml(text)}</pre>
        <button type="button" class="wg-button secondary" data-copy="${id}">${t('editor_setup_copy')}</button>
      </div>`;
    return `
      <p>${t('editor_setup_step_install')}</p>
      ${row('wg-install-cmd', command)}
      <p>${t('editor_setup_step_secret')}</p>
      ${row('wg-secret-line', secret)}
      <p>${t('editor_setup_step_sensor')}</p>
      <p>${t('editor_setup_not_saved')}</p>
      <button type="button" class="wg-button secondary" id="wg-generate">${t('editor_setup_regenerate')}</button>`;
  }

  _bindSetup(lang) {
    const body = this.querySelector('.wg-setup-body');
    body.querySelector('#wg-generate').addEventListener('click', () => {
      this._setupToken = wgGenerateToken();
      body.innerHTML = this._setupBody(lang);
      this._bindSetup(lang);
    });
    body.querySelectorAll('[data-copy]').forEach(button => {
      button.addEventListener('click', () => this._copy(button, lang));
    });
  }

  async _copy(button, lang) {
    const source = this.querySelector(`#${button.dataset.copy}`);
    const text = source.textContent;
    try {
      // The Clipboard API needs HTTPS; plain-HTTP installs fall back to
      // selecting the text so the user can press Ctrl/Cmd+C.
      await navigator.clipboard.writeText(text);
      button.textContent = wgT(lang, 'editor_setup_copied');
      setTimeout(() => { button.textContent = wgT(lang, 'editor_setup_copy'); }, 1500);
    } catch (e) {
      const range = document.createRange();
      range.selectNodeContents(source);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  _syncValues() {
    if (!this._config) return;
    const picker = this.querySelector('#entity-picker');
    const desiredEntity = this._config.entity || '';
    if (picker && picker.value !== desiredEntity) {
      picker.value = desiredEntity;
    }
    const titleInput = this.querySelector('#title-input');
    const desiredTitle = this._config.title || '';
    // Don't overwrite the title while the user is editing it — would risk
    // resetting cursor position even when the value happens to match.
    if (titleInput && titleInput.value !== desiredTitle && document.activeElement !== titleInput) {
      titleInput.value = desiredTitle;
    }
    const toggle = this.querySelector('#connected-only');
    const desiredToggle = this._config.connected_only === true;
    if (toggle && toggle.checked !== desiredToggle) {
      toggle.checked = desiredToggle;
    }
    const langPicker = this.querySelector('#language-picker');
    const desiredLang = this._config.language || '';
    if (langPicker && langPicker.value !== desiredLang) {
      langPicker.value = desiredLang;
    }
  }
}

// Guard against the resource being loaded twice (e.g. a duplicate dashboard
// resource), which would otherwise throw on the second define().
if (!customElements.get('wireguard-card')) {
  customElements.define('wireguard-card-editor', WireguardCardEditor);
  customElements.define('wireguard-card', WireguardCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'wireguard-card',
    name: 'WireGuard Card',
    description: 'Displays WireGuard VPN peer status from a REST sensor.',
    preview: false,
    documentationURL: 'https://github.com/filipeamorimdev/home-assistant-wireguard-card',
  });

  console.info(
    `%c WIREGUARD-CARD %c v${WG_CARD_VERSION} `,
    'color: #fff; background: #88171a; font-weight: 700;',
    'color: #88171a; background: #fff; font-weight: 700;',
  );
}