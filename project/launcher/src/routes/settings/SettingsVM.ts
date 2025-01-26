import { Routes } from "$lib/features/Routes";
import { event } from "@tauri-apps/api";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { get, writable } from "svelte/store";

export const state = writable({
  activeTab: 0,
});

export function load() {
  onSelectTab(3);
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
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    window.location.replace(Routes.SEARCH);
  }
});
