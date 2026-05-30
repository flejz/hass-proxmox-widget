import { LitElement, html, css } from 'lit';

class ProxmoxCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  static styles = css`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
    ha-textfield,
    ha-select {
      width: 100%;
    }
    .section-title {
      font-size: 0.85em;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: -4px;
    }
    .toggles {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    ha-formfield {
      display: block;
    }
  `;

  setConfig(config) {
    this._config = {
      title: 'Proxmox',
      mode: 'normal',
      show_network: true,
      show_storage: true,
      sort_vms: 'name',
      ...config,
    };
  }

  _changed(key, value) {
    if (!this._config) return;
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: { ...this._config, [key]: value } },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    if (!this._config) return html``;
    const c = this._config;

    return html`
      <div class="editor">

        <!-- Appearance -->
        <div class="section-title">Appearance</div>

        <ha-textfield
          label="Card title"
          .value=${c.title ?? 'Proxmox'}
          @change=${e => this._changed('title', e.target.value)}
        ></ha-textfield>

        <ha-select
          label="Display mode"
          .value=${c.mode ?? 'normal'}
          @value-changed=${e => this._changed('mode', e.detail.value)}
          fixedMenuPosition
        >
          <mwc-list-item value="minimal">Minimal — CPU + RAM bars only</mwc-list-item>
          <mwc-list-item value="normal">Normal — full stats + network</mwc-list-item>
          <mwc-list-item value="dense">Dense — compact, no network row</mwc-list-item>
        </ha-select>

        <!-- VM sorting -->
        <div class="section-title">VMs &amp; Containers</div>

        <ha-select
          label="Sort VMs / containers by"
          .value=${c.sort_vms ?? 'name'}
          @value-changed=${e => this._changed('sort_vms', e.detail.value)}
          fixedMenuPosition
        >
          <mwc-list-item value="name">Name (A → Z)</mwc-list-item>
          <mwc-list-item value="cpu">CPU usage (high → low)</mwc-list-item>
          <mwc-list-item value="ram">RAM usage (high → low)</mwc-list-item>
          <mwc-list-item value="disk">Disk usage (high → low)</mwc-list-item>
        </ha-select>

        <!-- Sections visibility -->
        <div class="section-title">Sections</div>

        <div class="toggles">
          <ha-formfield label="Show Network section">
            <ha-switch
              .checked=${c.show_network !== false}
              @change=${e => this._changed('show_network', e.target.checked)}
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Show Storage section">
            <ha-switch
              .checked=${c.show_storage !== false}
              @change=${e => this._changed('show_storage', e.target.checked)}
            ></ha-switch>
          </ha-formfield>
        </div>

      </div>
    `;
  }
}

customElements.define('proxmox-card-editor', ProxmoxCardEditor);
