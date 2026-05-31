import { LitElement, html, css } from 'lit';
import { discoverProxmoxEntities } from '../utils/entity-finder.js';

class ProxmoxCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  static styles = css`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 18px;
      padding: 16px;
    }
    .section-title {
      font-size: 0.78em;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    ha-textfield,
    ha-select {
      width: 100%;
    }
    /* Mode pills */
    .mode-row { display: flex; gap: 8px; }
    .mode-btn {
      flex: 1;
      padding: 8px 0;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: none;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.9em;
      color: var(--secondary-text-color);
      transition: all 0.15s;
    }
    .mode-btn.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-weight: 500;
    }
    /* Column toggles */
    .col-row { display: flex; gap: 6px; }
    .col-btn {
      padding: 5px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      background: none;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.82em;
      color: var(--secondary-text-color);
      transition: all 0.15s;
    }
    .col-btn.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    /* Check lists */
    .check-list {
      display: flex;
      flex-direction: column;
    }
    ha-formfield {
      display: block;
    }
    /* Section toggles */
    .toggles { display: flex; flex-direction: column; gap: 4px; }
    .sub-label {
      font-size: 0.8em;
      color: var(--secondary-text-color);
      margin-bottom: 6px;
    }
    .no-entities {
      font-size: 0.82em;
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `;

  setConfig(config) {
    this._config = {
      title: 'Proxmox',
      mode: 'normal',
      show_network: true,
      show_storage: true,
      show_vm_cpu: true,
      show_vm_mem: true,
      show_vm_disk: true,
      sort_vms: 'name',
      nodes: null,
      vms: null,
      ...config,
    };
  }

  _fire(key, value) {
    if (!this._config) return;
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: { ...this._config, [key]: value } },
      bubbles: true,
      composed: true,
    }));
  }

  _isNodeSelected(id, allIds) {
    const f = this._config.nodes;
    return f === null || (f ?? []).includes(id);
  }

  _isVmSelected(id) {
    const f = this._config.vms;
    return f === null || (f ?? []).includes(id);
  }

  _toggleNode(id, checked, allIds) {
    const selected = this._config.nodes === null ? [...allIds] : [...(this._config.nodes ?? [])];
    const updated = checked ? [...new Set([...selected, id])] : selected.filter(x => x !== id);
    this._fire('nodes', updated.length === allIds.length ? null : updated);
  }

  _toggleVm(id, checked, allIds) {
    const selected = this._config.vms === null ? [...allIds] : [...(this._config.vms ?? [])];
    const updated = checked ? [...new Set([...selected, id])] : selected.filter(x => x !== id);
    this._fire('vms', updated.length === allIds.length ? null : updated);
  }

  _toggleCol(key) {
    this._fire(key, this._config[key] !== false ? false : true);
  }

  render() {
    if (!this._config) return html``;

    const discovery = this.hass
      ? discoverProxmoxEntities(this.hass, {})
      : { nodes: [], vms: [], storages: [] };
    const { nodes, vms } = discovery;
    const allNodeIds = nodes.map(n => n.device_id);
    const allVmIds = vms.map(v => v.device_id);
    const c = this._config;

    return html`
      <div class="editor">

        <!-- ── Display ── -->
        <div class="section-title">Display</div>

        <ha-textfield
          label="Card title"
          .value=${c.title ?? 'Proxmox'}
          @change=${e => this._fire('title', e.target.value)}
        ></ha-textfield>

        <div>
          <div class="sub-label">Mode</div>
          <div class="mode-row">
            <button class="mode-btn ${c.mode !== 'dense' ? 'active' : ''}"
              @click=${() => this._fire('mode', 'normal')}>Normal</button>
            <button class="mode-btn ${c.mode === 'dense' ? 'active' : ''}"
              @click=${() => this._fire('mode', 'dense')}>Dense</button>
          </div>
        </div>

        <!-- ── Nodes ── -->
        <div class="section-title">Nodes</div>
        ${nodes.length === 0
          ? html`<div class="no-entities">No Proxmox nodes found. Configure the integration first.</div>`
          : html`
            <div class="check-list">
              ${nodes.map(node => html`
                <ha-formfield .label=${node.name}>
                  <ha-checkbox
                    .checked=${this._isNodeSelected(node.device_id, allNodeIds)}
                    @change=${e => this._toggleNode(node.device_id, e.target.checked, allNodeIds)}
                  ></ha-checkbox>
                </ha-formfield>
              `)}
            </div>
          `}

        <!-- ── VMs & Containers ── -->
        <div class="section-title">VMs &amp; Containers</div>

        <ha-select
          label="Sort by"
          .value=${c.sort_vms ?? 'name'}
          @value-changed=${e => this._fire('sort_vms', e.detail.value)}
          fixedMenuPosition
        >
          <mwc-list-item value="name">Name (A → Z)</mwc-list-item>
          <mwc-list-item value="cpu">CPU usage (high → low)</mwc-list-item>
          <mwc-list-item value="ram">RAM usage (high → low)</mwc-list-item>
          <mwc-list-item value="disk">Disk usage (high → low)</mwc-list-item>
        </ha-select>

        <div>
          <div class="sub-label">Show columns</div>
          <div class="col-row">
            ${[['show_vm_cpu', 'CPU'], ['show_vm_mem', 'MEM'], ['show_vm_disk', 'DSK']].map(([key, label]) => html`
              <button class="col-btn ${c[key] !== false ? 'active' : ''}"
                @click=${() => this._toggleCol(key)}>${label}</button>
            `)}
          </div>
        </div>

        ${vms.length === 0
          ? html`<div class="no-entities">No VMs or containers found.</div>`
          : html`
            <div class="check-list">
              ${vms.map(vm => html`
                <ha-formfield .label=${`${vm.name} (${vm.type === 'vm' ? 'VM' : 'CT'})`}>
                  <ha-checkbox
                    .checked=${this._isVmSelected(vm.device_id)}
                    @change=${e => this._toggleVm(vm.device_id, e.target.checked, allVmIds)}
                  ></ha-checkbox>
                </ha-formfield>
              `)}
            </div>
          `}

        <!-- ── Sections ── -->
        <div class="section-title">Sections</div>
        <div class="toggles">
          <ha-formfield label="Show Network section">
            <ha-switch
              .checked=${c.show_network !== false}
              @change=${e => this._fire('show_network', e.target.checked)}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label="Show Storage section">
            <ha-switch
              .checked=${c.show_storage !== false}
              @change=${e => this._fire('show_storage', e.target.checked)}
            ></ha-switch>
          </ha-formfield>
        </div>

      </div>
    `;
  }
}

customElements.define('proxmox-card-editor', ProxmoxCardEditor);
