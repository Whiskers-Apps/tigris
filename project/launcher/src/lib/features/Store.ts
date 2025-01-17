import { invoke } from "@tauri-apps/api/core";
import axios from "axios";
import type { Theme } from "./Settings";

export interface StoreExtension {
  id: string;
  name: string;
  description: string;
  repository: string;
  author: string;
}

export interface StoreTheme {
  id: string;
  name: string;
  repository: string;
  author: string;
  files: ThemeFile[];
}

export interface ThemeFile {
  name: string;
  link: string;
}

export async function getExtensionsStore(): Promise<StoreExtension[]> {
  return await invoke("invoke_get_extensions_store");
}

export async function getThemesStore(): Promise<StoreTheme[]> {
  return await invoke("invoke_get_themes_store");
}

export async function fetchExtensionsStore() {}

export async function fetchThemesStore() {
  axios
    .get(
      "https://raw.githubusercontent.com/Whiskers-Apps/tigris-store/refs/heads/master/store/themes.json"
    )
    .then((response) => {
      let store: StoreTheme[] = response.data;
      invoke("invoke_write_themes_store", { store: store });
    })
    .catch((error) => console.error(error));
}

export async function fetchTheme(link: string): Promise<Theme> {
  let response = await axios.get(link);
  return response.data;
}
