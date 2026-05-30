import { LitElement, html, css } from 'lit';
import { discoverProxmoxEntities } from './utils/entity-finder.js';
import { formatGiB, formatNetMbs } from './utils/formatters.js';
import './components/stat-bar.js';
import './components/node-row.js';
import './components/vm-row.js';
import './components/card-editor.js';

const MODES = ['minimal', 'normal', 'dense'];

class ProxmoxCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _mode: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }
    .card-content {
      padding: 16px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .title {
      font-size: 1em;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .mode-switcher {
      display: flex;
      gap: 3px;
    }
    .mode-btn {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 0.68em;
      font-family: inherit;
      letter-spacing: 0.02em;
      padding: 2px 7px;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    .mode-btn[aria-pressed='true'] {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .node-block {
      margin-bottom: 12px;
    }
    .node-block:last-child {
      margin-bottom: 0;
    }
    .node-divider {
      border: none;
      border-top: 1px solid var(--divider-color);
      margin: 10px 0;
    }
    .section-label {
      color: var(--secondary-text-color);
      font-size: 0.7em;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    /* VMs & Containers header with column labels */
    .vm-section-header {
      display: flex;
      align-items: center;
      margin: 8px 0 2px;
    }
    .vm-section-title {
      flex: 1;
      color: var(--secondary-text-color);
      font-size: 0.7em;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .vm-col-labels {
      display: flex;
      gap: 2px;
      font-size: 0.62em;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .vcl {
      text-align: right;
      width: 3.2em;
    }
    .vcl-wide {
      text-align: right;
      width: 4em;
    }
    .vm-list {
      display: flex;
      flex-direction: column;
    }
    .vm-list[data-mode='dense'] proxmox-vm-row {
      border-bottom: 1px solid var(--divider-color, transparent);
    }
    /* Network section */
    .net-section {
      margin-top: 4px;
    }
    .net-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 3px 0;
      font-size: 0.82em;
    }
    .net-name {
      flex: 1;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .net-val {
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
      font-size: 0.88em;
      min-width: 5.5em;
      text-align: right;
    }
    .net-dir {
      opacity: 0.55;
    }
    /* Storage section */
    .storage-section {
      margin-top: 4px;
    }
    .storage-item {
      margin-bottom: 4px;
    }
    .storage-name {
      font-size: 0.8em;
      color: var(--primary-text-color);
      margin-bottom: 1px;
    }
    .empty {
      color: var(--secondary-text-color);
      font-size: 0.88em;
      padding: 12px 0;
      text-align: center;
    }
  `;

  static getStubConfig() {
    return { title: 'Proxmox', mode: 'normal' };
  }

  static getConfigElement() {
    return document.createElement('proxmox-card-editor');
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    this._config = {
      title: 'Proxmox',
      mode: 'normal',
      exclude: [],
      show_network: true,
      show_storage: true,
      sort_vms: 'name',
      ...config,
    };
    if (!MODES.includes(this._config.mode)) {
      this._config.mode = 'normal';
    }
    this._mode = null;
  }

  get _activeMode() {
    return this._mode ?? this._config?.mode ?? 'normal';
  }

  _switchMode(mode) {
    this._mode = mode;
  }

  _sortVms(vms) {
    const key = this._config?.sort_vms ?? 'name';
    if (key === 'name') return vms; // already sorted by entity-finder
    return [...vms].sort((a, b) => {
      const stateOf = (vm, role) => parseFloat(vm.entities?.[role]?.state?.state) || 0;
      const roleMap = { cpu: 'cpu', ram: 'memory_pct', disk: 'disk_gb' };
      const role = roleMap[key] ?? 'cpu';
      return stateOf(b, role) - stateOf(a, role); // descending
    });
  }

  render() {
    if (!this.hass || !this._config) return html``;

    const { nodes, vms: rawVms, storages } = discoverProxmoxEntities(this.hass, this._config);
    const vms = this._sortVms(rawVms);
    const mode = this._activeMode;

    return html`
      <ha-card>
        <div class="card-content">
          ${this._renderHeader(mode)}
          ${nodes.length === 0 && vms.length === 0
            ? html`<div class="empty">No Proxmox entities found.<br>Configure the Proxmox VE integration in Home Assistant.</div>`
            : this._renderNodes(nodes, vms, storages, mode)}
        </div>
      </ha-card>
    `;
  }

  _renderHeader(mode) {
    return html`
      <div class="header">
        <span class="title">${this._config.title}</span>
        <div class="mode-switcher" role="group" aria-label="Display mode">
          ${MODES.map((m) => html`
            <button
              class="mode-btn"
              aria-pressed=${mode === m ? 'true' : 'false'}
              @click=${() => this._switchMode(m)}
            >${m}</button>
          `)}
        </div>
      </div>
    `;
  }

  _renderNodes(nodes, vms, storages, mode) {
    const orphanVms = vms.filter(
      (vm) => !nodes.find((n) => n.device_id === vm.node_device_id)
    );

    if (nodes.length === 0) {
      return html`
        ${this._renderVmSection(vms, mode)}
        ${this._renderNetworkSection(vms, mode)}
        ${this._renderStorageSection(storages, mode)}
      `;
    }

    return html`
      ${nodes.map((node, idx) => {
        const nodeVms = vms.filter((vm) => vm.node_device_id === node.device_id);
        const nodeStorages = storages.filter((s) => s.node_device_id === node.device_id);
        return html`
          ${idx > 0 ? html`<hr class="node-divider">` : ''}
          <div class="node-block">
            <proxmox-node-row .group=${node} .mode=${mode}></proxmox-node-row>
            ${nodeVms.length > 0
              ? html`
                  ${this._renderVmSection(nodeVms, mode)}
                  ${this._config.show_network !== false ? this._renderNetworkSection(nodeVms, mode) : ''}
                `
              : ''}
            ${nodeStorages.length > 0 && this._config.show_storage !== false
              ? this._renderStorageSection(nodeStorages, mode)
              : ''}
          </div>
        `;
      })}
      ${orphanVms.length > 0
        ? html`
            <hr class="node-divider">
            ${this._renderVmSection(orphanVms, mode)}
            ${this._config.show_network !== false ? this._renderNetworkSection(orphanVms, mode) : ''}
          `
        : ''}
      ${(() => {
          const orphanStorages = storages.filter(s => !nodes.find(n => n.device_id === s.node_device_id));
          return orphanStorages.length > 0 && this._config.show_storage !== false
            ? this._renderStorageSection(orphanStorages, mode)
            : '';
        })()}
    `;
  }

  _renderVmSection(vmList, mode) {
    if (!vmList.length) return html``;
    return html`
      <div class="vm-section-header">
        <span class="vm-section-title">VMs &amp; Containers</span>
        ${mode !== 'minimal'
          ? html`
              <div class="vm-col-labels">
                <span class="vcl">CPU</span>
                <span class="vcl">MEM</span>
                <span class="vcl-wide">DSK</span>
              </div>
            `
          : ''}
      </div>
      <div class="vm-list" data-mode=${mode}>
        ${vmList.map((vm) => html`
          <proxmox-vm-row .group=${vm} mode=${mode}></proxmox-vm-row>
        `)}
      </div>
    `;
  }

  _renderNetworkSection(vmList, mode) {
    if (mode === 'minimal') return html``;
    const withNet = vmList.filter(
      (vm) => vm.entities.net_in_mbs || vm.entities.net_out_mbs
    );
    if (!withNet.length) return html``;

    return html`
      <div class="section-label" style="margin-top:10px">Network</div>
      <div class="net-section">
        ${withNet.map((vm) => {
          const netIn = vm.entities.net_in_mbs?.state?.state;
          const netOut = vm.entities.net_out_mbs?.state?.state;
          return html`
            <div class="net-row">
              <span class="net-name">${vm.name}</span>
              <span class="net-val"><span class="net-dir">↑</span> ${formatNetMbs(netOut)}</span>
              <span class="net-val"><span class="net-dir">↓</span> ${formatNetMbs(netIn)}</span>
            </div>
          `;
        })}
      </div>
    `;
  }

  _renderStorageSection(storageList, mode) {
    if (mode === 'minimal') return html``;
    if (!storageList.length) return html``;

    return html`
      <div class="section-label" style="margin-top:10px">Storage</div>
      <div class="storage-section">
        ${storageList.map((s) => {
          const usedGb = s.entities.used_gb?.state?.state;
          const pct = parseFloat(s.entities.used_pct?.state?.state) || 0;
          return html`
            <div class="storage-item">
              <div class="storage-name">${s.name}</div>
              <proxmox-stat-bar
                .label=${' '}
                .value=${formatGiB(usedGb)}
                .percent=${pct}
              ></proxmox-stat-bar>
            </div>
          `;
        })}
      </div>
    `;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('proxmox-card', ProxmoxCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'proxmox-card',
  name: 'Proxmox Card',
  description: 'Monitor Proxmox VE nodes, VMs, and containers',
  preview: false,
  documentationURL: 'https://github.com/flejz/hass-proxmox-widget',
});
