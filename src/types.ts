export interface LaundryCardConfig {
  type: string;

  // Entity IDs
  washer_power_entity: string;
  dryer_power_entity: string;
  washer_status_entity: string;  // input_select: idle/running/finished
  dryer_status_entity: string;   // input_select: idle/running/finished

  // Optional door sensors (shows door state indicator)
  washer_door_entity?: string;
  dryer_door_entity?: string;

  // Labels
  washer_label?: string;   // default: "Washer"
  dryer_label?: string;    // default: "Dryer"

  // Colors
  color_running?: string;  // default: "#4CAF50"
  color_finished?: string; // default: "#FFC107"
  color_idle?: string;     // default: "var(--card-background-color, #1c1c1c)"

  // Display options
  show_power?: boolean;        // default: true
  show_time?: boolean;         // default: true (minutes since finished)
  show_labels?: boolean;       // default: true
  show_door_indicator?: boolean; // default: true

  // SVG appearance
  svg_width?: number;      // default: 130
  svg_height?: number;     // default: 180
  stroke_width?: number;   // default: 3
  fill_opacity?: number;   // default: 0.7

  // Text
  text_color_on_fill?: string;  // default: "#000000"
}

export interface MachineState {
  status: 'idle' | 'running' | 'finished';
  power: number;
  minutes: number | null;
  doorOpen: boolean | null;
}
