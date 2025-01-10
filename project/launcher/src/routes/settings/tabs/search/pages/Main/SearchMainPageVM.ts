import type { SelectValue } from "$lib/features/Extensions";
import {
  getSettings,
  setHideAppIcons,
  setShortcutKey,
  setShowRecentApps,
  setShowShortcutHint,
  writeSettings,
} from "$lib/repositories/SettingsRepository";
import { getUpperCasedFirstLetter } from "$lib/utils/TextFormatting";
import { get, writable } from "svelte/store";
import { Pages, state as searchPageState } from "../../SearchPageVM";
import type { App } from "$lib/features/Apps";
import { invoke } from "@tauri-apps/api/core";

export const state = writable({
  loading: true,
  blacklisted_apps: [] as App[],
});

export async function load() {
  let newState = get(state);
  newState.loading = false;
  newState.blacklisted_apps = await invoke("invoke_get_blacklisted_apps");

  console.log(newState.blacklisted_apps);

  state.set(newState);
}

// =================================================================
// ==== Intents
// =================================================================

export function onSetShowRecentApps(value: boolean) {
  setShowRecentApps(value);
}

export function onSetHideAppIcons(value: boolean) {
  setHideAppIcons(value);
}

export function onSetShowShortcutHint(value: boolean) {
  setShowShortcutHint(value);
}

export function onSetShortcutKey(value: SelectValue) {
  setShortcutKey(value.id);
}

export function onOpenAddEnginePage() {
  let newState = get(searchPageState);
  newState.page = Pages.ADD_ENGINE;
  searchPageState.set(newState);
}

export function onOpenEditEnginePage(id: number) {
  let newState = get(searchPageState);
  newState.page = Pages.EDIT_ENGINE;
  newState.editingEngineId = id;
  searchPageState.set(newState);
}

export function onOpenAddBlacklistPage() {
  let newState = get(searchPageState);
  newState.page = Pages.ADD_BLACKLIST;
  searchPageState.set(newState);
}

export function removeFromBlacklist(path: string) {
  let newSettings = getSettings();
  let newState = get(state);

  newSettings.blacklist = newSettings.blacklist.filter((p) => p !== path);
  newState.blacklisted_apps = newState.blacklisted_apps.filter((app) => app.path !== path);

  writeSettings(newSettings);
  state.set(newState);
}

// =================================================================
// ==== Utils
// =================================================================

export function asSelectValue(key: string): SelectValue {
  return {
    id: key,
    text: getUpperCasedFirstLetter(key),
  };
}

export function getShortcutKeys(): SelectValue[] {
  return [asSelectValue("alt"), asSelectValue("ctrl")];
}
