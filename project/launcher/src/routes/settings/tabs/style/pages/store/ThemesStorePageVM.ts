import { fetchTheme, fetchThemesStore, getThemesStore, type StoreTheme } from "$lib/features/Store";
import { get, writable } from "svelte/store";
import { onGoToPage, StyleSettingsPage } from "../StylePageVM";
import type { SelectFieldValue } from "$lib/features/ResultAction";
import { getSettings, writeSettings } from "$lib/repositories/SettingsRepository";
import { refreshCSS } from "$lib/components/layouts/MainLayoutVM";
import { Sniffer } from "sniffer-ts";

type ThemesStoreState = {
  loading: boolean;
  themes: StoreTheme[];
  searchValue: string;
  selectedValues: Map<string, SelectFieldValue>;
  applyingTheme: boolean;
};

export const state = writable<ThemesStoreState>({
  loading: true,
  themes: [],
  searchValue: "",
  selectedValues: new Map(),
  applyingTheme: false,
});

let themes: StoreTheme[] = [];
let sniffer = new Sniffer();

function getState(): ThemesStoreState {
  return get(state);
}

function setState(newState: ThemesStoreState) {
  state.set(newState);
}

export async function load() {
  let newState = getState();

  newState.themes = await getThemesStore();

  setState(newState);

  if (newState.themes.length === 0) {
    await fetchThemesStore();
  }

  themes = await getThemesStore();

  newState.themes = themes;
  newState.loading = false;

  newState.themes.forEach((theme) => {
    newState.selectedValues.set(theme.id, {
      id: theme.files[0].link,
      text: theme.files[0].name,
    });
  });

  setState(newState);

  await fetchThemesStore();

  newState.themes = await getThemesStore();

  newState.themes.forEach((theme) => {
    newState.selectedValues.set(theme.id, {
      id: theme.files[0].link,
      text: theme.files[0].name,
    });
  });

  setState(newState);
}

export function onGoBack() {
  let newState = getState();
  newState.searchValue = "";
  setState(newState);

  onGoToPage(StyleSettingsPage.MAIN);
}

export function onSearchInput(value: string) {
  let newState = getState();

  newState.themes = themes.filter((theme) => sniffer.matches(theme.name, value));
  newState.searchValue = value;

  state.set(newState);
}

export function getSelectValues(theme: StoreTheme): SelectFieldValue[] {
  const values: SelectFieldValue[] = theme.files.map((file) => {
    return { id: file.link, text: file.name };
  });

  return values;
}

export function getSelectedValue(theme: StoreTheme): SelectFieldValue {
  return getState().selectedValues.get(theme.id)!!;
}

export function setSelectValue(theme: StoreTheme, selectValue: SelectFieldValue) {
  let newState = getState();

  newState.selectedValues.set(theme.id, selectValue);

  setState(newState);
}

export async function onApplyTheme(theme: StoreTheme) {
  let newState = getState();
  newState.applyingTheme = true;
  setState(newState);

  let selectedValue = getSelectedValue(theme);
  let storeTheme = await fetchTheme(selectedValue.id);

  let newSettings = getSettings();
  newSettings.theme = storeTheme;
  writeSettings(newSettings);

  refreshCSS();

  newState.applyingTheme = false;
  setState(newState);
}
