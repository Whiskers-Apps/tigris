import { get, writable } from "svelte/store";
import { Pages, state as searchPageState } from "../../SearchPageVM";
import { getSettings, writeSettings } from "$lib/repositories/SettingsRepository";

export const state = writable({
  keyword: "",
  name: "",
  query: "",
  keywordError: null as string | null,
  nameError: null as string | null,
  queryError: null as string | null,
  disableSaveButton: true,
});

export function onGoBack() {
  clearState();

  let newSearchPageState = get(searchPageState);
  newSearchPageState.page = Pages.MAIN;
  searchPageState.set(newSearchPageState);
}

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

export function onSave() {
  let newState = get(state);
  let newSettings = getSettings();
  let newSearchEngines = newSettings.search_engines;
  const biggestId = newSearchEngines.reduce((max, current) => Math.max(max, current.id), 0);

  newSearchEngines.push({
    id: biggestId + 1,
    keyword: newState.keyword,
    name: newState.name,
    query: newState.query,
  });

  newSettings.search_engines = newSearchEngines;

  writeSettings(newSettings);

  onGoBack();
}

function clearState() {
  let newState = get(state);
  newState.keyword = "";
  newState.name = "";
  newState.query = "";
  newState.keywordError = null;
  newState.nameError = null;
  newState.queryError = "";
  newState.disableSaveButton = true;
  state.set(newState);
}

export function validateForms() {
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
