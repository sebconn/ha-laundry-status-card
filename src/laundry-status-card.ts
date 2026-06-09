import { LaundryCardConfig, MachineState } from './types';
import washerSvg from './assets/washer.svg';
import dryerSvg from './assets/dryer.svg';
const CARD_VERSION = '1.0.2';

console.info(`%c LAUNDRY-STATUS-CARD %c v${CARD_VERSION} `, 'background:#4CAF50;color:#fff;font-weight:bold', 'background:#333;color:#fff');

class LaundryStatusCard extends HTMLElement {
  private config!: LaundryCardConfig;
  private _hass: any;

  static getStubConfig() {
    return {
      washer_power_entity: '',
      dryer_power_entity: '',
      washer_status_entity: '',
      dryer_status_entity: '',
    };
  }

  setConfig(config: LaundryCardConfig) {
    if (!config.washer_power_entity) throw new Error('washer_power_entity is required');
    if (!config.dryer_power_entity) throw new Error('dryer_power_entity is required');
    if (!config.washer_status_entity) throw new Error('washer_status_entity is required');
    if (!config.dryer_status_entity) throw new Error('dryer_status_entity is required');
    this.config = config;
  }

  set hass(hass: any) {
    this._hass = hass;
    this.render();
  }

  private getState(powerEntity: string, statusEntity: string, doorEntity?: string): MachineState {
    const hass = this._hass;
    const power = parseFloat(hass.states[powerEntity]?.state) || 0;
    const status = (hass.states[statusEntity]?.state || 'idle') as MachineState['status'];
    const lastChanged = hass.states[statusEntity]?.last_changed;
    const minutes = status === 'finished' && lastChanged
      ? Math.floor((Date.now() - new Date(lastChanged).getTime()) / 60000)
      : null;
    let doorOpen: boolean | null = null;
    if (doorEntity && hass.states[doorEntity]) {
      doorOpen = hass.states[doorEntity].state === 'on';
    }
    return { status, power, minutes, doorOpen };
  }

  private getColor(status: MachineState['status']): string {
    const c = this.config;
    switch (status) {
      case 'running': return c.color_running ?? '#4CAF50';
      case 'finished': return c.color_finished ?? '#FFC107';
      default: return c.color_idle ?? 'var(--card-background-color, #1c1c1c)';
    }
  }

  private renderMachine(svg: string, state: MachineState, label: string): string {
    const c = this.config;
    const color = this.getColor(state.status);
    const width = c.svg_width ?? 130;
    const height = c.svg_height ?? 180;
    const fillOpacity = c.fill_opacity ?? 0.7;
    const textColor = state.status !== 'idle' ? (c.text_color_on_fill ?? '#000000') : 'var(--primary-text-color)';
    const showPower = c.show_power !== false;
    const showTime = c.show_time !== false;
    const showLabels = c.show_labels !== false;

    const styledSvg = svg.replace('var(--status-color)', color);
    const timeText = showTime && state.minutes !== null ? `${state.minutes}m` : '';
    const powerText = showPower && state.status === 'running' ? `${Math.round(state.power)}W` : '';
    const statusText = state.status === 'idle' ? 'Idle' : (state.status === 'finished' ? 'Done' : '');

    return `
      <div class="machine">
        <div class="svg-container" style="width:${width}px;height:${height}px;position:relative">
          <div style="opacity:${fillOpacity}">${styledSvg}</div>
          ${timeText ? `<div class="overlay-text" style="color:${textColor}">${timeText}</div>` : ''}
        </div>
        ${showLabels ? `<div class="label">${label}</div>` : ''}
        <div class="sub-label">${powerText || statusText}</div>
      </div>`;
  }

  private render() {
    if (!this._hass || !this.config) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

    const c = this.config;
    const washer = this.getState(c.washer_power_entity, c.washer_status_entity, c.washer_door_entity);
    const dryer = this.getState(c.dryer_power_entity, c.dryer_status_entity, c.dryer_door_entity);

    this.shadowRoot!.innerHTML = `
      <style>
        :host { display: block; }
        .container { display: flex; justify-content: center; gap: 32px; padding: 0 16px 16px; }
        .machine { text-align: center; }
        .svg-container { position: relative; display: inline-block; }
        .svg-container svg { width: 100%; height: 100%; color: var(--primary-text-color); }
        .overlay-text {
          position: absolute; top: 62%; left: 50%;
          transform: translate(-50%, -50%);
          font-size: 20px; font-weight: bold;
        }
        .label { font-weight: bold; margin-top: 4px; }
        .sub-label { font-size: 12px; opacity: 0.7; }
      </style>
      <div class="container">
        ${this.renderMachine(washerSvg, washer, c.washer_label ?? 'Washer')}
        ${this.renderMachine(dryerSvg, dryer, c.dryer_label ?? 'Dryer')}
      </div>`;
  }

  getCardSize() { return 4; }
}

customElements.define('laundry-status-card', LaundryStatusCard);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'laundry-status-card',
  name: 'Laundry Status Card',
  description: 'Shows washer and dryer status with SVG visuals',
  preview: true,
});
