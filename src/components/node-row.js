import { LitElement, html, css } from 'lit';
import { formatPercent, formatGiB, formatUptime, formatNetMbs } from '../utils/formatters.js';
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

  _s(key) {
    return this.group?.entities?.[key]?.state?.state ?? null;
  }

  render() {
    const { mode, group } = this;

    const cpu = this._s('cpu');
    const memPct = this._s('memory_pct');
    const diskGb = this._s('disk_gb');
    const diskMaxGb = this._s('disk_max_gb');
    const uptimeH = this._s('uptime_h');

    const cpuPercent = parseFloat(cpu) || 0;
    const memPercent = parseFloat(memPct) || 0;
    const diskPercent = diskGb && diskMaxGb
      ? (parseFloat(diskGb) / parseFloat(diskMaxGb)) * 100
      : 0;

    return html`
      <div class="header">
        <span class="node-name">${group?.name ?? '—'}</span>
        ${mode !== 'minimal'
          ? html`<span class="uptime">${formatUptime(uptimeH)}</span>`
          : ''}
      </div>

      <proxmox-stat-bar
        .label=${'CPU'}
        .value=${formatPercent(cpu)}
        .percent=${cpuPercent}
      ></proxmox-stat-bar>

      <proxmox-stat-bar
        .label=${'RAM'}
        .value=${formatPercent(memPct)}
        .percent=${memPercent}
      ></proxmox-stat-bar>

      ${mode !== 'minimal'
        ? html`
            <proxmox-stat-bar
              .label=${'DSK'}
              .value=${formatGiB(diskGb)}
              .percent=${diskPercent}
            ></proxmox-stat-bar>
          `
        : ''}
    `;
  }
}

customElements.define('proxmox-node-row', ProxmoxNodeRow);
