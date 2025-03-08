import { getSettings, writeSettings } from "$lib/repositories/SettingsRepository";
import { get, writable } from "svelte/store";
import { Pages, state as searchPageState } from "../../SearchPageVM";
import type { SearchEngine } from "$lib/features/Settings";

export const state = writable({
  loading: true,
  id: -1,
  keyword: "",
  name: "",
  query: "",
  default: false,
  disableSaveButton: false,
  keywordError: null as string | null,
  nameError: null as string | null,
  queryError: null as string | null,
  showDeleteDialog: false,
});

export async function load(id: number) {
  let engine = getSettings().search_engines.find((engine) => engine.id === id)!!;
  let newState = get(state);

  newState.loading = false;
  newState.id = id;
  newState.keyword = engine.keyword;
  newState.name = engine.name;
  newState.query = engine.query;
  newState.default = getSettings().default_search_engine === newState.id;

  state.set(newState);
}

// =================================================================
// ==== Intents
// =================================================================

export function onKeywordInput(text: string) {
  let newState = get(state);
  newState.keyword = text;
  state.set(newState);

  validateForms();
}

export function onNameInput(text: string) {
  let newState = get(state);
  newState.name = text;
  state.set(newState);

  validateForms();
}

export function onQueryInput(text: string) {
  let newState = get(state);
  newState.query = text;
  state.set(newState);

  validateForms();
}

export function onSetDefault(value: boolean) {
  let newState = get(state);
  newState.default = value;
  state.set(newState);
}

export function onGoBack() {
  clearState();

  let newSearchPageState = get(searchPageState);
  newSearchPageState.page = Pages.MAIN;
  searchPageState.set(newSearchPageState);
}

export function onSave() {
  let settings = getSettings();
  let engines = settings.search_engines;
  let newState = get(state);

  let newEngines = engines.map((engine: SearchEngine) => {
    if (engine.id === newState.id) {
      return {
        id: engine.id,
        keyword: newState.keyword,
        name: newState.name,
        query: newState.query,
      };
    }

    return engine;
  });

  settings.search_engines = newEngines;

  if (newState.default) {
    settings.default_search_engine = newState.id;
  }

  writeSettings(settings);

  onGoBack();
}

export function onShowDeleteDialog() {
  let newState = get(state);
  newState.showDeleteDialog = true;
  state.set(newState);
}

export function onCloseDeleteDialog() {
  let newState = get(state);
  newState.showDeleteDialog = false;
  state.set(newState);
}

export function onDelete() {
  let engineId = get(state).id;
  let newSettings = getSettings();

  newSettings.search_engines = newSettings.search_engines.filter(
    (engine) => engine.id !== engineId
  );

  writeSettings(newSettings);

  onCloseDeleteDialog();
  onGoBack();
}

// =================================================================
// ==== Utils
// =================================================================

export function clearState() {
  let newState = get(state);
  newState.loading = true;
  newState.keyword = "";
  newState.name = "";
  newState.query = "";
  newState.keywordError = null;
  newState.nameError = null;
  newState.queryError = "";
  newState.disableSaveButton = false;
  state.set(newState);
}

function validateForms() {
  let urlRegex = RegExp(
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
  );

  let newState = get(state);
  newState.keywordError = null;
  newState.nameError = null;
  newState.queryError = null;

  let keywordInvalid = newState.keyword.trim().length == 0;
  let nameInvalid = newState.name.trim().length == 0;
  let queryIncludesS = newState.query.includes("%s");
  let queryMatchesRegex = newState.query.match(urlRegex);
  let queryIsEmpty = newState.query.trim().length == 0;
  let urlInvalid = !queryMatchesRegex || !queryIncludesS || queryIsEmpty;

  if (keywordInvalid) {
    newState.keywordError = "Keyword must not be empty!";
  }

  if (nameInvalid) {
    newState.nameError = "Name must not be empty!";
  }

  if (!queryIncludesS) {
    newState.queryError = "Must have a %s in the url!";
  }

  if (!queryMatchesRegex) {
    newState.queryError = "Query must have a valid url!";
  }

  if (queryIsEmpty) {
    newState.queryError = "Query must not be empty!";
  }

  newState.disableSaveButton = keywordInvalid || nameInvalid || urlInvalid;
  state.set(newState);
}
