import { LitElement, html, css } from 'lit';
import { formatPercent } from '../utils/formatters.js';

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
      width: 3.5em;
    }
  `;

  _e(key) {
    return this.group?.entities?.[key]?.state?.state ?? null;
  }

  render() {
    const { mode, group } = this;

    const runningState = this._e('running');
    const cpuState = this._e('cpu');
    const memPctState = this._e('memory_pct');

    const isOn = runningState === 'on';
    const typeBadge = group?.type === 'lxc' ? 'CT' : 'VM';
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
              <span class="stat">${formatPercent(cpuState)}</span>
              <span class="stat">${formatPercent(memPctState)}</span>
            </div>
          `
        : ''}
    `;
  }
}

customElements.define('proxmox-vm-row', ProxmoxVmRow);
