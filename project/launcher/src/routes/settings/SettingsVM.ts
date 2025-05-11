import { Routes } from "$lib/features/Routes";
import { event } from "@tauri-apps/api";
import { invoke } from "@tauri-apps/api/core";
import { get, writable } from "svelte/store";

export const state = writable({
  activeTab: 0,
});

export function load() {
  onSelectTab(0);
}

// =================================================================
// ==== Intents
// =================================================================

export function onGoBack() {
  window.location.replace(Routes.SEARCH);
}

export function onSelectTab(index: number) {
  let newState = get(state);
  newState.activeTab = index;
  state.set(newState);

  document.getElementById("settings-page")?.scrollTo({ top: 0 });
}

document.addEventListener("keydown", async (event) => {
  if (event.key === "Escape") {
    window.location.replace(Routes.SEARCH);
  }
});
