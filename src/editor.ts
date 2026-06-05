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
  { name: 'color_running', selector: { color_rgb: {} } },
  { name: 'color_finished', selector: { color_rgb: {} } },
  { name: 'color_idle', selector: { color_rgb: {} } },
  { name: 'show_power', selector: { boolean: {} } },
  { name: 'show_time', selector: { boolean: {} } },
  { name: 'show_labels', selector: { boolean: {} } },
  { name: 'svg_width', selector: { number: { min: 80, max: 200, step: 10 } } },
  { name: 'svg_height', selector: { number: { min: 120, max: 250, step: 10 } } },
  { name: 'fill_opacity', selector: { number: { min: 0, max: 1, step: 0.1 } } },
];

class LaundryStatusCardEditor extends HTMLElement {
  private _config!: LaundryCardConfig;
  private _hass: any;

  setConfig(config: LaundryCardConfig) {
    this._config = config;
    this.render();
  }

  set hass(hass: any) {
    this._hass = hass;
    this.render();
  }

  private render() {
    if (!this._config || !this._hass) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

    this.shadowRoot!.innerHTML = `<ha-form
      .hass=${this._hass}
      .data=${this._config}
      .schema=${SCHEMA}
      .computeLabel=${(s: any) => s.name.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
      @value-changed=${this._valueChanged}
    ></ha-form>`;

    const form = this.shadowRoot!.querySelector('ha-form') as any;
    if (form) {
      form.hass = this._hass;
      form.data = this._config;
      form.schema = SCHEMA;
      form.computeLabel = (s: any) => s.name.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      form.addEventListener('value-changed', this._valueChanged.bind(this));
    }
  }

  private _valueChanged(ev: CustomEvent) {
    const config = ev.detail.value;
    const event = new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
}

customElements.define('laundry-status-card-editor', LaundryStatusCardEditor);
