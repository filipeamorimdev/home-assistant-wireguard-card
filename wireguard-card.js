const WG_TRANSLATIONS = {
  en: {
    entity_not_found: 'Entity not found',
    status_online: 'online',
    status_offline: 'offline',
    meta_endpoint: 'endpoint',
    meta_allowed_ips: 'allowed IPs',
    meta_last_handshake: 'last handshake',
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
  },
  pt: {
    entity_not_found: 'Entidade não encontrada',
    status_online: 'online',
    status_offline: 'offline',
    meta_endpoint: 'endpoint',
    meta_allowed_ips: 'IPs permitidos',
    meta_last_handshake: 'último handshake',
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
  },
  es: {
    entity_not_found: 'Entidad no encontrada',
    status_online: 'en línea',
    status_offline: 'desconectado',
    meta_endpoint: 'endpoint',
    meta_allowed_ips: 'IPs permitidas',
    meta_last_handshake: 'último handshake',
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
  },
  fr: {
    entity_not_found: 'Entité introuvable',
    status_online: 'en ligne',
    status_offline: 'hors ligne',
    meta_endpoint: 'endpoint',
    meta_allowed_ips: 'IPs autorisées',
    meta_last_handshake: 'dernier handshake',
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
  },
  de: {
    entity_not_found: 'Entität nicht gefunden',
    status_online: 'online',
    status_offline: 'offline',
    meta_endpoint: 'Endpunkt',
    meta_allowed_ips: 'Erlaubte IPs',
    meta_last_handshake: 'Letzter Handshake',
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

// Escape user/API-derived values before interpolating them into innerHTML.
// Safe for both element-text and double-quoted-attribute contexts.
function wgEscapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Backwards-compatible alias.
const wgEscapeAttr = wgEscapeHtml;

class WireguardCard extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    const lang = wgResolveLanguage(this._config, hass);
    const entity = hass.states[this._config.entity];
    if (!entity) {
      this.innerHTML = `<ha-card><div style="padding:1rem;color:var(--error-color)">${wgT(lang, 'entity_not_found')}: ${wgEscapeHtml(this._config.entity)}</div></ha-card>`;
      return;
    }
    const attrs = entity.attributes;
    const peers = attrs.peers || {};
    const activePeers = attrs.active_peers ?? entity.state;
    const totalPeers = attrs.total_peers ?? Object.keys(peers).length;
    const updatedAt = attrs.updated_at ? new Date(attrs.updated_at).toLocaleString(lang) : '';

    const connectedOnly = this._config.connected_only === true;
    const visiblePeers = Object.values(peers).filter(p => !connectedOnly || p.connected);

    const peerRows = visiblePeers.map(p => {
      const online = p.connected;
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
              <span class="wg-meta-val wg-meta-val--${online ? 'good' : 'muted'}">${wgEscapeHtml(p.latest_handshake ?? '')}</span>
            </div>
          </div>
          <div class="wg-transfer">
            <div class="wg-transfer-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
              <span class="wg-tx-label">${wgT(lang, 'transfer_rx')}</span>
              <span class="wg-tx-val">${wgEscapeHtml(p.transfer_rx_human ?? '')}</span>
            </div>
            <div class="wg-transfer-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
              <span class="wg-tx-label">${wgT(lang, 'transfer_tx')}</span>
              <span class="wg-tx-val">${wgEscapeHtml(p.transfer_tx_human ?? '')}</span>
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
              <p class="wg-stat-val">${activePeers} <span>/ ${totalPeers}</span></p>
            </div>
          </div>
          ${peerRows}
          ${updatedAt ? `<div class="wg-updated">${wgT(lang, 'updated')} ${updatedAt}</div>` : ''}
        </div>
      </ha-card>`;
  }

  setConfig(config) {
    if (!config.entity) throw new Error('Please define an entity');
    this._config = config;
  }

  getCardSize() { return 4; }

  static getConfigElement() {
    return document.createElement('wireguard-card-editor');
  }

  static getStubConfig(hass) {
    // Pre-select the first sensor entity that looks like a vpn_stats sensor
    const guess = Object.keys(hass.states).find(e =>
      e.startsWith('sensor.') && e.includes('vpn')
    ) || '';
    return { entity: guess };
  }
}

class WireguardCardEditor extends HTMLElement {
  setConfig(config) {
    const previousLang = this._config ? this._config.language : undefined;
    this._config = config;
    if (!this._built) {
      this._render();
      return;
    }
    // Re-render only when the language explicitly changes — a discrete user
    // action — so the editor labels reflect the new language. All other
    // setConfig calls (toggle, sensor change, hass updates) just sync values
    // in-place to preserve focus.
    if (previousLang !== config.language) {
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
      return `<option value="${e}" ${selected}>${label} (${e})</option>`;
    }).join('');

    const languageOptions = Object.keys(WG_LANG_NAMES).map(code => {
      const selected = this._config.language === code ? 'selected' : '';
      return `<option value="${code}" ${selected}>${WG_LANG_NAMES[code]}</option>`;
    }).join('');

    const titleValue = wgEscapeAttr(this._config.title || '');
    const titlePlaceholder = wgEscapeAttr(wgT(lang, 'title'));

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
      </div>`;

    this._built = true;

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
      this._config = { ...this._config, connected_only: e.target.checked };
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

customElements.define('wireguard-card-editor', WireguardCardEditor);
customElements.define('wireguard-card', WireguardCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'wireguard-card',
  name: 'WireGuard Card',
  description: 'Displays WireGuard VPN peer status from a REST sensor.',
  preview: false,
});