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
    ha-textfield, ha-select {
      width: 100%;
    }
  `;

  setConfig(config) {
    this._config = { title: 'Proxmox', mode: 'normal', ...config };
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
    return html`
      <div class="editor">
        <ha-textfield
          label="Title"
          .value=${this._config.title ?? 'Proxmox'}
          @change=${e => this._changed('title', e.target.value)}
        ></ha-textfield>

        <ha-select
          label="Display mode"
          .value=${this._config.mode ?? 'normal'}
          @value-changed=${e => this._changed('mode', e.detail.value)}
          fixedMenuPosition
        >
          <mwc-list-item value="minimal">Minimal — CPU + RAM only</mwc-list-item>
          <mwc-list-item value="normal">Normal — full stats</mwc-list-item>
          <mwc-list-item value="dense">Dense — compact layout</mwc-list-item>
        </ha-select>
      </div>
    `;
  }
}

customElements.define('proxmox-card-editor', ProxmoxCardEditor);
