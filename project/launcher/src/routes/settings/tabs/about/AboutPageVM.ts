import { get, writable } from "svelte/store";
import { getVersion } from "@tauri-apps/api/app";
import { state as mainState } from "$lib/components/layouts/MainLayoutVM";
import { invoke } from "@tauri-apps/api/core";
import type { Extension } from "$lib/features/Extensions";

export const state = writable({
  loading: true,
  version: "",
  extensionCount: 0,
});

export async function load() {
  let newState = get(state);
  let extensions: Extension[] = await invoke("invoke_get_extensions");

  newState.version = await getVersion();
  newState.extensionCount = extensions.length;
  newState.loading = false;

  state.set(newState);
}

export function onOpenLink(link: string) {
  invoke("invoke_open_link", { link: link });
}
