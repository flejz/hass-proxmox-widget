import { LitElement, html, css } from 'lit';
import { discoverProxmoxEntities } from './utils/entity-finder.js';
import './components/stat-bar.js';
import './components/node-row.js';
import './components/vm-row.js';

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
    .vm-section-label {
      color: var(--secondary-text-color);
      font-size: 0.7em;
      font-weight: 500;
      letter-spacing: 0.06em;
      margin: 8px 0 4px;
      text-transform: uppercase;
    }
    .vm-list {
      display: flex;
      flex-direction: column;
    }
    .vm-list[data-mode='dense'] proxmox-vm-row {
      border-bottom: 1px solid var(--divider-color, transparent);
    }
    .empty {
      color: var(--secondary-text-color);
      font-size: 0.88em;
      padding: 12px 0;
      text-align: center;
    }
  `;

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    this._config = {
      title: 'Proxmox',
      mode: 'normal',
      exclude: [],
      ...config,
    };
    // Validate mode
    if (!MODES.includes(this._config.mode)) {
      this._config.mode = 'normal';
    }
    this._mode = null; // reset user override on config change
  }

  get _activeMode() {
    return this._mode ?? this._config?.mode ?? 'normal';
  }

  _switchMode(mode) {
    this._mode = mode;
  }

  render() {
    if (!this.hass || !this._config) return html``;

    const { nodes, vms } = discoverProxmoxEntities(this.hass, this._config);
    const mode = this._activeMode;

    return html`
      <ha-card>
        <div class="card-content">
          ${this._renderHeader(mode)}
          ${nodes.length === 0 && vms.length === 0
            ? html`<div class="empty">No Proxmox entities found.<br>Configure the Proxmox VE integration in Home Assistant.</div>`
            : this._renderNodes(nodes, vms, mode)}
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

  _renderNodes(nodes, vms, mode) {
    // VMs without a matching node (shouldn't happen normally, but handle gracefully)
    const orphanVms = vms.filter(
      (vm) => !nodes.find((n) => n.device_id === vm.node_device_id)
    );

    if (nodes.length === 0) {
      // No nodes discovered — show all VMs ungrouped
      return html`${this._renderVmList(vms, mode)}`;
    }

    return html`
      ${nodes.map((node, idx) => {
        const nodeVms = vms.filter((vm) => vm.node_device_id === node.device_id);
        return html`
          ${idx > 0 ? html`<hr class="node-divider">` : ''}
          <div class="node-block">
            <proxmox-node-row .group=${node} .mode=${mode}></proxmox-node-row>
            ${nodeVms.length > 0 && mode !== 'minimal'
              ? html`
                  <div class="vm-section-label">VMs &amp; Containers</div>
                  ${this._renderVmList(nodeVms, mode)}
                `
              : ''}
          </div>
        `;
      })}
      ${orphanVms.length > 0
        ? html`
            <hr class="node-divider">
            <div class="vm-section-label">Other</div>
            ${this._renderVmList(orphanVms, mode)}
          `
        : ''}
    `;
  }

  _renderVmList(vmList, mode) {
    return html`
      <div class="vm-list" data-mode=${mode}>
        ${vmList.map((vm) => html`
          <proxmox-vm-row .group=${vm} mode=${mode}></proxmox-vm-row>
        `)}
      </div>
    `;
  }

  // Required for HA card editor / size computation
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
