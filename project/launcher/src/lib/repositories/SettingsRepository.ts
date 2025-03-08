import { refreshCSS } from "$lib/components/layouts/MainLayoutVM";
import type { Settings, Theme } from "$lib/features/Settings";
import { invoke } from "@tauri-apps/api/core";
import { get, writable } from "svelte/store";

export const settings = writable({} as Settings);

export async function load() {
  settings.set(await invoke("invoke_get_settings"));
}

export async function refreshSettings() {
  settings.set(await invoke("invoke_get_settings"));
}

export function getSettings(): Settings {
  return get(settings);
}

export function writeSettings(newSettings: Settings) {
  settings.set(newSettings);
  invoke("invoke_write_settings", { settings: newSettings });
}

export function setShowRecentApps(value: boolean) {
  let newSettings = getSettings();
  newSettings.show_recent_apps = value;
  writeSettings(newSettings);
}

export function setHideAppIcons(value: boolean) {
  let newSettings = getSettings();
  newSettings.hide_app_icons = value;
  writeSettings(newSettings);
}

export function setShowShortcutHint(value: boolean) {
  let newSettings = getSettings();
  newSettings.show_shortcut_hint = value;
  writeSettings(newSettings);
}

export function setShortcutKey(value: string) {
  let newSettings = getSettings();
  newSettings.shortcut_key = value;
  writeSettings(newSettings);
}

export function setBoxBorderRadius(value: number) {
  let newSettings = getSettings();
  newSettings.box_border_radius = value;
  writeSettings(newSettings);

  refreshCSS();
}

export function setBoxBorderWidth(value: number) {
  let newSettings = getSettings();
  newSettings.border_width = value;
  writeSettings(newSettings);

  refreshCSS();
}

export function setAccentBorder(value: boolean) {
  let newSettings = getSettings();
  newSettings.accent_border = value;
  writeSettings(newSettings);

  refreshCSS();
}

export function setResultBorderRadius(value: number) {
  let newSettings = getSettings();
  newSettings.result_border_radius = value;
  writeSettings(newSettings);

  refreshCSS();
}

export function setIconBorderRadius(value: number) {
  let newSettings = getSettings();
  newSettings.icon_border_radius = value;
  writeSettings(newSettings);

  refreshCSS();
}

export function setTheme(theme: Theme) {
  let newSettings = getSettings();
  newSettings.theme = theme;
  writeSettings(newSettings);

  refreshCSS();
}
