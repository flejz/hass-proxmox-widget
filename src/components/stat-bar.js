import { LitElement, html, css } from 'lit';

class ProxmoxStatBar extends LitElement {
  static properties = {
    label: { type: String },
    value: { type: String },
    percent: { type: Number },
  };

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .label {
      color: var(--secondary-text-color);
      font-size: 0.75em;
      font-weight: 500;
      text-transform: uppercase;
      width: 2.6em;
      flex-shrink: 0;
      letter-spacing: 0.03em;
    }
    .track {
      flex: 1;
      height: 6px;
      border-radius: 3px;
      background: var(--divider-color);
      overflow: hidden;
    }
    .fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.4s ease;
    }
    .fill.success {
      background: var(--success-color, #43a047);
    }
    .fill.warning {
      background: var(--warning-color, #ffa600);
    }
    .fill.error {
      background: var(--error-color, #db4437);
    }
    .value {
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
      text-align: right;
      width: 4em;
      flex-shrink: 0;
      font-size: 0.82em;
    }
  `;

  _colorClass() {
    const p = this.percent ?? 0;
    if (p >= 90) return 'error';
    if (p >= 70) return 'warning';
    return 'success';
  }

  render() {
    const p = Math.min(100, Math.max(0, this.percent ?? 0));
    return html`
      <span class="label">${this.label}</span>
      <div class="track">
        <div class="fill ${this._colorClass()}" style="width:${p}%"></div>
      </div>
      <span class="value">${this.value}</span>
    `;
  }
}

customElements.define('proxmox-stat-bar', ProxmoxStatBar);
