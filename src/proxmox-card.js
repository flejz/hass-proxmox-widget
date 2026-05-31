import { LitElement, html, css } from 'lit';
import { discoverProxmoxEntities } from './utils/entity-finder.js';
import { formatPercent, formatGiB, formatNetMbs } from './utils/formatters.js';
import './components/stat-bar.js';
import './components/node-row.js';
import './components/card-editor.js';

const MODES = ['normal', 'dense'];

class ProxmoxCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _mode: { state: true },
  };

  static styles = css`
    :host { display: block; }
    .card-content { padding: 16px; }

    /* ── Header ── */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .title { font-size: 1em; font-weight: 600; color: var(--primary-text-color); }
    .mode-switcher { display: flex; gap: 3px; }
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

    /* ── Layout ── */
    .node-block { margin-bottom: 12px; }
    .node-block:last-child { margin-bottom: 0; }
    .node-divider { border: none; border-top: 1px solid var(--divider-color); margin: 10px 0; }
    .section-label {
      color: var(--secondary-text-color);
      font-size: 0.7em;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .empty { color: var(--secondary-text-color); font-size: 0.88em; padding: 12px 0; text-align: center; }

    /* ── VM rows (inline rendering for pixel-perfect column alignment) ── */
    .vm-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 0;
    }
    .vm-row.dense { padding: 2px 0; border-bottom: 1px solid var(--divider-color, transparent); }
    .vr-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .vr-dot.on  { background: var(--success-color,  #43a047); }
    .vr-dot.off { background: var(--disabled-color, #9e9e9e); }
    .vr-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--primary-text-color);
      font-size: 0.88em;
    }
    /* Fixed px width so header labels align perfectly with data columns */
    .vr-badge {
      width: 28px;
      text-align: center;
      font-size: 0.72em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--secondary-text-color);
      background: var(--divider-color);
      border-radius: 3px;
      padding: 2px 0;
      flex-shrink: 0;
    }
    .vr-stats { display: flex; gap: 2px; flex-shrink: 0; }
    .vr-stat {
      width: 42px;
      text-align: right;
      font-size: 0.82em;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .vr-stat-wide {
      width: 56px;
      text-align: right;
      font-size: 0.82em;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }

    /* Column header row — same flex structure, invisible placeholders */
    .vm-col-header { padding-top: 2px; padding-bottom: 3px; }
    .vm-col-header .vr-dot   { visibility: hidden; }
    .vm-col-header .vr-name  { visibility: hidden; }
    .vm-col-header .vr-badge { visibility: hidden; }
    .vm-col-header .vr-stat,
    .vm-col-header .vr-stat-wide {
      font-size: 0.68em;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--secondary-text-color);
    }

    /* ── Network section ── */
    .net-section { margin-top: 4px; }
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
    /* Fixed px so header UP/DOWN aligns with data values */
    .net-val {
      width: 74px;
      text-align: right;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
      font-size: 0.88em;
    }
    .net-header { padding-bottom: 2px; }
    .net-header .net-name { visibility: hidden; }
    .net-header .net-val {
      font-size: 0.7em;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    /* ── Storage section ── */
    .storage-section { margin-top: 4px; }
    .storage-item { margin-bottom: 4px; }
    .storage-name { font-size: 0.8em; color: var(--primary-text-color); margin-bottom: 1px; }
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
      show_vm_cpu: true,
      show_vm_mem: true,
      show_vm_disk: true,
      sort_vms: 'name',
      nodes: null,
      vms: null,
      ...config,
    };
    if (!MODES.includes(this._config.mode)) this._config.mode = 'normal';
    this._mode = null;
  }

  get _activeMode() {
    return this._mode ?? this._config?.mode ?? 'normal';
  }

  _switchMode(mode) { this._mode = mode; }

  _sortVms(vms) {
    const key = this._config?.sort_vms ?? 'name';
    if (key === 'name') return vms;
    return [...vms].sort((a, b) => {
      const v = (vm, role) => parseFloat(vm.entities?.[role]?.state?.state) || 0;
      const roleMap = { cpu: 'cpu', ram: 'memory_pct', disk: 'disk_gb' };
      return v(b, roleMap[key] ?? 'cpu') - v(a, roleMap[key] ?? 'cpu');
    });
  }

  render() {
    if (!this.hass || !this._config) return html``;
    const { nodes: allNodes, vms: allVms, storages } = discoverProxmoxEntities(this.hass, this._config);
    const nodeFilter = this._config.nodes;
    const vmFilter = this._config.vms;
    const nodes = nodeFilter === null ? allNodes : allNodes.filter(n => nodeFilter.includes(n.device_id));
    const vms = this._sortVms(vmFilter === null ? allVms : allVms.filter(v => vmFilter.includes(v.device_id)));
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
          ${MODES.map(m => html`
            <button class="mode-btn" aria-pressed=${mode === m ? 'true' : 'false'}
              @click=${() => this._switchMode(m)}>${m}</button>
          `)}
        </div>
      </div>
    `;
  }

  _renderNodes(nodes, vms, storages, mode) {
    const orphanVms = vms.filter(vm => !nodes.find(n => n.device_id === vm.node_device_id));

    if (nodes.length === 0) {
      return html`
        ${this._renderVmSection(vms, mode)}
        ${this._config.show_network !== false ? this._renderNetworkSection(vms, mode) : ''}
        ${this._config.show_storage !== false ? this._renderStorageSection(storages, mode) : ''}
      `;
    }

    return html`
      ${nodes.map((node, idx) => {
        const nodeVms = vms.filter(vm => vm.node_device_id === node.device_id);
        const nodeStorages = storages.filter(s => s.node_device_id === node.device_id);
        return html`
          ${idx > 0 ? html`<hr class="node-divider">` : ''}
          <div class="node-block">
            <proxmox-node-row .group=${node} .mode=${mode}></proxmox-node-row>
            ${nodeVms.length > 0 ? html`
              ${this._renderVmSection(nodeVms, mode)}
              ${this._config.show_network !== false ? this._renderNetworkSection(nodeVms, mode) : ''}
            ` : ''}
            ${nodeStorages.length > 0 && this._config.show_storage !== false
              ? this._renderStorageSection(nodeStorages, mode) : ''}
          </div>
        `;
      })}
      ${orphanVms.length > 0 ? html`
        <hr class="node-divider">
        ${this._renderVmSection(orphanVms, mode)}
        ${this._config.show_network !== false ? this._renderNetworkSection(orphanVms, mode) : ''}
      ` : ''}
      ${(() => {
        const o = storages.filter(s => !nodes.find(n => n.device_id === s.node_device_id));
        return o.length > 0 && this._config.show_storage !== false
          ? this._renderStorageSection(o, mode) : '';
      })()}
    `;
  }

  _renderVmRow(vm, mode) {
    const dense = mode === 'dense';
    const s = role => vm.entities?.[role]?.state?.state ?? null;
    const isOn = s('running') === 'on';
    const showCpu = this._config.show_vm_cpu !== false;
    const showMem = this._config.show_vm_mem !== false;
    const showDisk = this._config.show_vm_disk !== false;
    const hasStats = showCpu || showMem || showDisk;
    return html`
      <div class="vm-row ${dense ? 'dense' : ''}">
        <div class="vr-dot ${isOn ? 'on' : 'off'}"></div>
        <span class="vr-name">${vm.name}</span>
        <span class="vr-badge">${vm.type === 'vm' ? 'VM' : 'CT'}</span>
        ${hasStats ? html`
          <div class="vr-stats">
            ${showCpu ? html`<span class="vr-stat">${formatPercent(s('cpu'))}</span>` : ''}
            ${showMem ? html`<span class="vr-stat">${formatPercent(s('memory_pct'))}</span>` : ''}
            ${showDisk ? html`<span class="vr-stat-wide">${formatGiB(s('disk_gb'))}</span>` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  _renderVmSection(vmList, mode) {
    if (!vmList.length) return html``;
    const showCpu = this._config.show_vm_cpu !== false;
    const showMem = this._config.show_vm_mem !== false;
    const showDisk = this._config.show_vm_disk !== false;
    const hasStats = showCpu || showMem || showDisk;
    return html`
      <div class="section-label" style="margin: 8px 0 2px">VMs &amp; Containers</div>
      ${hasStats ? html`
        <div class="vm-row vm-col-header">
          <div class="vr-dot"></div>
          <span class="vr-name"></span>
          <span class="vr-badge"></span>
          <div class="vr-stats">
            ${showCpu ? html`<span class="vr-stat">CPU</span>` : ''}
            ${showMem ? html`<span class="vr-stat">MEM</span>` : ''}
            ${showDisk ? html`<span class="vr-stat-wide">DSK</span>` : ''}
          </div>
        </div>
      ` : ''}
      <div>${vmList.map(vm => this._renderVmRow(vm, mode))}</div>
    `;
  }

  _renderNetworkSection(vmList, mode) {
    const withNet = vmList.filter(vm => vm.entities.net_in_mbs || vm.entities.net_out_mbs);
    if (!withNet.length) return html``;
    return html`
      <div class="section-label" style="margin-top:10px">Network</div>
      <div class="net-section">
        <div class="net-row net-header">
          <span class="net-name"></span>
          <span class="net-val">UP</span>
          <span class="net-val">DOWN</span>
        </div>
        ${withNet.map(vm => {
          const netIn = vm.entities.net_in_mbs?.state?.state;
          const netOut = vm.entities.net_out_mbs?.state?.state;
          return html`
            <div class="net-row">
              <span class="net-name">${vm.name}</span>
              <span class="net-val">${formatNetMbs(netOut)}</span>
              <span class="net-val">${formatNetMbs(netIn)}</span>
            </div>
          `;
        })}
      </div>
    `;
  }

  _renderStorageSection(storageList, mode) {
    if (!storageList.length) return html``;
    return html`
      <div class="section-label" style="margin-top:10px">Storage</div>
      <div class="storage-section">
        ${storageList.map(s => {
          const usedGb = s.entities.used_gb?.state?.state;
          const pct = parseFloat(s.entities.used_pct?.state?.state) || 0;
          return html`
            <div class="storage-item">
              <div class="storage-name">${s.name}</div>
              <proxmox-stat-bar .label=${' '} .value=${formatGiB(usedGb)} .percent=${pct}></proxmox-stat-bar>
            </div>
          `;
        })}
      </div>
    `;
  }

  getCardSize() { return 3; }
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
