import { LaundryCardConfig } from './types';

const SCHEMA = [
  { name: 'washer_power_entity', required: true, selector: { entity: { domain: 'sensor', device_class: 'power' } } },
  { name: 'dryer_power_entity', required: true, selector: { entity: { domain: 'sensor', device_class: 'power' } } },
  { name: 'washer_status_entity', required: true, selector: { entity: { domain: 'input_select' } } },
  { name: 'dryer_status_entity', required: true, selector: { entity: { domain: 'input_select' } } },
  { name: 'washer_door_entity', selector: { entity: { domain: 'binary_sensor' } } },
  { name: 'dryer_door_entity', selector: { entity: { domain: 'binary_sensor' } } },
  { name: 'washer_label', selector: { text: {} } },
  { name: 'dryer_label', selector: { text: {} } },
  { name: 'color_running', selector: { text: {} } },
  { name: 'color_finished', selector: { text: {} } },
  { name: 'color_idle', selector: { text: {} } },
  { name: 'show_power', selector: { boolean: {} } },
  { name: 'show_time', selector: { boolean: {} } },
  { name: 'show_labels', selector: { boolean: {} } },
  { name: 'svg_width', selector: { number: { min: 80, max: 200, step: 10, mode: 'slider' } } },
  { name: 'svg_height', selector: { number: { min: 120, max: 250, step: 10, mode: 'slider' } } },
  { name: 'fill_opacity', selector: { number: { min: 0, max: 1, step: 0.1, mode: 'slider' } } },
];

class LaundryStatusCardEditor extends HTMLElement {
  private _config!: LaundryCardConfig;
  private _hass: any;
  private _form: any;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._form = document.createElement('ha-form');
    this._form.computeLabel = (s: any) => s.name.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    this._form.addEventListener('value-changed', (ev: any) => {
      const event = new CustomEvent('config-changed', {
        detail: { config: ev.detail.value },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    });
    this.shadowRoot!.appendChild(this._form);
  }

  setConfig(config: LaundryCardConfig) {
    this._config = config;
    this._form.data = config;
    this._form.schema = SCHEMA;
  }

  set hass(hass: any) {
    this._hass = hass;
    this._form.hass = hass;
  }
}

customElements.define('laundry-status-card-editor', LaundryStatusCardEditor);
