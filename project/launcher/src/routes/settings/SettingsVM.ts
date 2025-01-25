import { Routes } from "$lib/features/Routes";
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
