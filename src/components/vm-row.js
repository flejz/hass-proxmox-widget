import { LitElement, html, css } from 'lit';
import { formatPercent, formatGiB, formatNetMbs } from '../utils/formatters.js';

class ProxmoxVmRow extends LitElement {
  static properties = {
    group: { type: Object },
    mode: { type: String },
  };

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 0;
      box-sizing: border-box;
    }
    :host([mode='dense']) {
      padding: 2px 0;
      font-size: 0.82em;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .dot.on {
      background: var(--success-color, #43a047);
    }
    .dot.off {
      background: var(--disabled-color, #9e9e9e);
    }
    .name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--primary-text-color);
      font-size: 0.88em;
    }
    .badge {
      font-size: 0.72em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--secondary-text-color);
      background: var(--divider-color);
      border-radius: 3px;
      padding: 1px 4px;
      flex-shrink: 0;
    }
    .stats {
      display: flex;
      gap: 2px;
      flex-shrink: 0;
    }
    .stat {
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
      font-size: 0.78em;
      text-align: right;
      width: 3.2em;
    }
    .stat-wide {
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
      font-size: 0.78em;
      text-align: right;
      width: 4em;
    }
  `;

  _s(key) {
    return this.group?.entities?.[key]?.state?.state ?? null;
  }

  render() {
    const { mode, group } = this;

    const runningState = this._s('running'); // binary_sensor state: 'on'/'off'
    const cpu = this._s('cpu');
    const memPct = this._s('memory_pct');
    const diskGb = this._s('disk_gb');
    const diskMaxGb = this._s('disk_max_gb');

    const isOn = runningState === 'on';
    const typeBadge = group?.type === 'vm' ? 'VM' : 'CT';
    const minimal = mode === 'minimal';

    return html`
      <div class="dot ${isOn ? 'on' : 'off'}"></div>
      <span class="name">${group?.name ?? '—'}</span>
      ${!minimal
        ? html`<span class="badge">${typeBadge}</span>`
        : ''}
      ${!minimal
        ? html`
            <div class="stats">
              <span class="stat">${formatPercent(cpu)}</span>
              <span class="stat">${formatPercent(memPct)}</span>
              <span class="stat-wide">${formatGiB(diskGb)}</span>
            </div>
          `
        : ''}
    `;
  }
}

customElements.define('proxmox-vm-row', ProxmoxVmRow);
