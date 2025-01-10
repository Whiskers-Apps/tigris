export interface Settings {
  show_recent_apps: boolean;
  box_border_radius: number;
  border_width: number;
  result_border_radius: number;
  icon_border_radius: number;
  hide_app_icons: boolean;
  accent_border: boolean;
  show_shortcut_hint: boolean;
  shortcut_key: string;
  theme: Theme;
  extension_values: ExtensionValue[];
  search_engines: SearchEngine[];
  default_search_engine: number;
  blacklist: string[];
}

export interface Theme {
  accent: string;
  on_accent: string;
  danger: string;
  on_danger: string;
  background: string;
  secondary_background: string;
  tertiary_background: string;
  text: string;
  secondary_text: string;
  tertiary_text: string;
  disabled_text: string;
}

export interface ExtensionValue {
  extension_id: string;
  setting_id: string;
  value: string;
}

export interface SearchEngine {
  id: number;
  keyword: string;
  name: string;
  query: string;
}
