import { get, writable } from "svelte/store";
import { Pages, state as searchPageState } from "../../SearchPageVM";
import type { App } from "$lib/features/Apps";
import { invoke } from "@tauri-apps/api/core";
import { getSettings, writeSettings } from "$lib/repositories/SettingsRepository";

export const state = writable({
  loading: true,
  apps: [] as App[],
  selectedApps: [] as string[],
});

export async function load() {
  let newState = get(state);

  newState.loading = false;
  newState.apps = await invoke("invoke_get_whitelisted_apps");
  newState.selectedApps = [];

  state.set(newState);
}

// =================================================================
// ==== Intents
// =================================================================

export function onGoBack() {
  let newSearchPageState = get(searchPageState);
  newSearchPageState.page = Pages.MAIN;
  searchPageState.set(newSearchPageState);
}

export function onToggleApp(path: string) {
  let newState = get(state);
  let newSelectedApps = newState.selectedApps;

  if (!newState.selectedApps.includes(path)) {
    newSelectedApps.push(path);
  } else {
    newSelectedApps = newSelectedApps.filter((p) => p !== path);
  }

  newState.selectedApps = newSelectedApps;
  state.set(newState);
}

export function onSave() {
  let newState = get(state);
  let newSettings = getSettings();
  let newBlacklistedApps = newSettings.blacklist;

  newState.selectedApps.forEach((path) => {
    newBlacklistedApps.push(path);
  });

  newSettings.blacklist = newBlacklistedApps;

  writeSettings(newSettings);

  onGoBack();
}
