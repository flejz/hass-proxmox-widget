import { LitElement, html, css } from 'lit';
import { formatPercent, formatBytes, formatUptime, formatNet } from '../utils/formatters.js';
import './stat-bar.js';

class ProxmoxNodeRow extends LitElement {
  static properties = {
    group: { type: Object },
    mode: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }
    .header {
      display: flex;
      align-items: baseline;
      gap: 6px;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--divider-color);
      margin-bottom: 5px;
    }
    .node-name {
      flex: 1;
      font-weight: 600;
      font-size: 0.9em;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .uptime {
      color: var(--secondary-text-color);
      font-size: 0.75em;
      white-space: nowrap;
      flex-shrink: 0;
    }
    proxmox-stat-bar {
      margin-bottom: 3px;
    }
    proxmox-stat-bar:last-of-type {
      margin-bottom: 0;
    }
    .net-row {
      display: flex;
      gap: 10px;
      margin-top: 4px;
      color: var(--secondary-text-color);
      font-size: 0.75em;
      font-variant-numeric: tabular-nums;
    }
    .net-row span {
      display: flex;
      align-items: center;
      gap: 2px;
    }
  `;

  _e(key) {
    return this.group?.entities?.[key]?.state?.state ?? null;
  }

  render() {
    const { mode, group } = this;
    const entities = group?.entities ?? {};

    const cpuState = this._e('cpu');
    const memPctState = this._e('memory_pct');
    const diskState = this._e('disk');
    const diskPctState = this._e('disk_pct');
    const netInState = this._e('net_in');
    const netOutState = this._e('net_out');
    const uptimeState = this._e('uptime');

    const cpuPercent = parseFloat(cpuState) || 0;
    const memPercent = parseFloat(memPctState) || 0;
    const diskPercent = parseFloat(diskPctState) || 0;
    const diskBytes = diskState != null ? parseFloat(diskState) : null;

    const netIn = netInState != null ? parseFloat(netInState) : null;
    const netOut = netOutState != null ? parseFloat(netOutState) : null;
    const uptimeSec = uptimeState != null ? parseFloat(uptimeState) : null;

    return html`
      <div class="header">
        <span class="node-name">${group?.name ?? '—'}</span>
        ${mode !== 'minimal'
          ? html`<span class="uptime">${formatUptime(uptimeSec)}</span>`
          : ''}
      </div>

      <proxmox-stat-bar
        .label=${'CPU'}
        .value=${formatPercent(cpuState)}
        .percent=${cpuPercent}
      ></proxmox-stat-bar>

      <proxmox-stat-bar
        .label=${'RAM'}
        .value=${formatPercent(memPctState)}
        .percent=${memPercent}
      ></proxmox-stat-bar>

      ${mode !== 'minimal'
        ? html`
            <proxmox-stat-bar
              .label=${'DSK'}
              .value=${formatBytes(diskBytes)}
              .percent=${diskPercent}
            ></proxmox-stat-bar>
          `
        : ''}

      ${mode === 'normal'
        ? html`
            <div class="net-row">
              <span>&#x2191; ${formatNet(netOut)}</span>
              <span>&#x2193; ${formatNet(netIn)}</span>
            </div>
          `
        : ''}
    `;
  }
}

customElements.define('proxmox-node-row', ProxmoxNodeRow);
