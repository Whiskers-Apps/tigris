import type { SearchResult } from "$lib/features/Results";
import { Routes } from "$lib/features/Routes";
import { getCssFilter } from "$lib/features/Theming";
import { getCurrentWindow, } from "@tauri-apps/api/window";
import { get, writable } from "svelte/store";
import { getSettings, } from "$lib/repositories/SettingsRepository";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

export const state = writable({
  loading: true,
  searchText: "",
  results: [] as SearchResult[],
  totalResultsCount: 0,
  offset: 0,
  selectedIndex: 0,
  accentFilter: "",
  askConfirmation: false,
});

let results: SearchResult[] = [];

export async function load() {
  let newState = get(state);

  results = await invoke("invoke_get_search_results", { search_text: "" });

  newState.results = getSlicedResults(0);
  newState.totalResultsCount = results.length;
  newState.accentFilter = getCssFilter(getSettings().theme.accent);
  newState.loading = false;

  state.set(newState);

  await listen("show", async (_event) => {
    (document.getElementById("search") as HTMLInputElement).value = "";
    document.getElementById("search")?.focus();

    results = await invoke("invoke_get_search_results", { search_text: "" });
    let newState = get(state);

    newState.offset = 0;
    newState.selectedIndex = 0;
    newState.searchText = "";
    newState.results = getSlicedResults(0);
    newState.totalResultsCount = results.length;
    newState.askConfirmation = false;

    state.set(newState);
  });

}

// ================================================================
// ==== Helper Functions
// ================================================================

function getSlicedResults(offset: number): SearchResult[] {
  return results.slice(offset, offset + 8);
}

export function getColorFilter(tint: string | null): string {
  if (tint === null) {
    return "none";
  }

  if (tint === "accent") {
    return get(state).accentFilter;
  }

  return getCssFilter(tint);
}

// ================================================================
// ==== Intents
// ================================================================

export async function onSearchInput(text: string) {
  let newState = get(state);

  invoke("refresh_window");
  results = await invoke("invoke_get_search_results", { search_text: text });

  newState.offset = 0;
  newState.selectedIndex = 0;
  newState.searchText = text;
  newState.results = getSlicedResults(0);
  newState.totalResultsCount = results.length;
  newState.askConfirmation = false;


  state.set(newState);
  invoke("refresh_window");
}

export function onGoDown() {
  let newState = get(state);
  newState.askConfirmation = false;

  if (newState.selectedIndex < newState.results.length - 1) {
    newState.selectedIndex = newState.selectedIndex + 1;
    state.set(newState);
    return;
  }

  if (newState.offset + newState.selectedIndex < results.length - 1) {
    newState.offset = newState.offset + 1;
    newState.results = getSlicedResults(newState.offset);

    state.set(newState);
    return;
  }

  if (results.length < 8) {
    if (newState.selectedIndex + 1 === results.length) {
      newState.selectedIndex = 0;
      state.set(newState);
      return;
    }
  }

  newState.offset = 0;
  newState.selectedIndex = 0;
  newState.results = getSlicedResults(newState.offset);

  state.set(newState);
}

export function onGoUp() {
  let newState = get(state);
  newState.askConfirmation = false;

  if (newState.selectedIndex > 0) {
    newState.selectedIndex = newState.selectedIndex - 1;
    state.set(newState);
    return;
  }

  if (newState.offset - 1 > 0) {
    newState.offset = newState.offset - 1;
    newState.results = getSlicedResults(newState.offset);
    state.set(newState);
    return;
  }

  if (newState.offset === 0) {
    if (results.length < 8) {
      newState.selectedIndex = results.length - 1;
      state.set(newState);
      return;
    }
  }

  newState.offset = results.length - 8;
  newState.selectedIndex = 7;
  newState.results = getSlicedResults(newState.offset);
  state.set(newState);
}

export function onResultHover(index: number) {
  let newState = get(state);
  newState.selectedIndex = index;
  newState.askConfirmation = false;
  state.set(newState);
}

export function onSelectResult(index: number, fromShortcut: boolean = false) {
  let actualIndex = fromShortcut ? index - 1 : index;
  let newState = get(state);

  if (actualIndex < newState.results.length) {
    newState.selectedIndex = actualIndex;

    state.set(newState);

    onRunAction();
  }
}

export async function onRunAction() {
  invoke("refresh_window");

  let newState = get(state);
  let result = newState.results[newState.selectedIndex];
  let action = result.action;

  if (action !== null) {
    if (!newState.askConfirmation) {
      if (action.require_confirmation) {
        newState.askConfirmation = true;
        state.set(newState);
      } else {
        if (action.action_type === "OpenSettings") {
          window.location.replace(Routes.SETTINGS);
          return;
        }

        invoke("invoke_run_action", { action: action });

        if (action.action_type === "OpenForm") {
          window.location.replace(Routes.FORM);
        }
      }
    } else {
      newState.askConfirmation = false;
      state.set(newState);

      invoke("invoke_run_action", { action: action });
    }
  }

  invoke("refresh_window");
}

// ================================================================
// ==== Listeners
// ================================================================

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "Escape": {
      getCurrentWindow().hide();
      break;
    }

    case "ArrowUp": {
      event.preventDefault();
      onGoUp();
      break;
    }

    case "ArrowDown": {
      event.preventDefault();
      onGoDown();
      break;
    }

    case "Enter": {
      onRunAction();
      break;
    }
  }

  if (event.altKey && ["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key)) {
    if (getSettings().shortcut_key === "alt") {
      onSelectResult(+event.key, true);
    }
  }

  if (event.ctrlKey && ["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key)) {
    if (getSettings().shortcut_key === "ctrl") {
      onSelectResult(+event.key, true);
    }
  }
});
