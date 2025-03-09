import { get, writable } from "svelte/store";
import { ExtensionsSettingsPage, onGoToPage } from "../../ExtensionsPageVM";
import { fetchExtensionsStore, getExtensionsStore, type StoreExtension } from "$lib/features/Store";
import { Sniffer } from "sniffer-ts";
import type { Extension } from "$lib/features/Extensions";
import { invoke } from "@tauri-apps/api/core";

type State = {
  loading: boolean;
  searchValue: string;
  extensions: StoreExtension[];
  installingExtension: boolean;
  installedExtensions: string[];
};

export const state = writable<State>({
  loading: true,
  searchValue: "",
  extensions: [],
  installingExtension: false,
  installedExtensions: [],
});

let extensions: StoreExtension[] = [];
let sniffer = new Sniffer();

export async function load() {
  let newState = get(state);

  extensions = await getExtensionsStore();

  if (extensions.length === 0) {
    await fetchExtensionsStore();
  }

  extensions = await getExtensionsStore();

  newState.extensions = extensions;
  let installedExtensions: Extension[] = await invoke("invoke_get_extensions");

  newState.installedExtensions = installedExtensions.map((extension) => extension.id);
  newState.loading = false;

  state.set(newState);

  await fetchExtensionsStore();

  extensions = await getExtensionsStore();

  newState.extensions = extensions;
  installedExtensions = await invoke("invoke_get_extensions");
  newState.installedExtensions = installedExtensions.map((extension) => extension.id);

  state.set(newState);
}

export function onGoBack() {
  let newState = get(state);
  newState.searchValue = "";
  state.set(newState);

  onGoToPage(ExtensionsSettingsPage.MAIN);
}

export function onSearchInput(value: string) {
  let newState = get(state);
  newState.searchValue = value;

  state.set(newState);

  newState.extensions = extensions.filter(
    (extension) =>
      sniffer.matches(extension.name, value) || sniffer.matches(extension.description, value)
  );

  state.set(newState);
}

export async function onInstallExtension(extension: StoreExtension) {
  let newState = get(state);
  newState.installingExtension = true;

  state.set(newState);

  await invoke("invoke_install_extension", { link: extension.repository });

  let installedExtensions: Extension[] = await invoke("invoke_get_extensions");

  newState.installedExtensions = installedExtensions.map((extension) => extension.id);
  newState.installingExtension = false;

  state.set(newState);
}
