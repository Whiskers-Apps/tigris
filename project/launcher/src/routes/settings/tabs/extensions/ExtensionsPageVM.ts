import { get, writable } from "svelte/store";

type State = {
  page: ExtensionsSettingsPage;
};

export enum ExtensionsSettingsPage {
  MAIN,
  STORE,
}

export const state = writable<State>({
  page: ExtensionsSettingsPage.MAIN,
});

export function onGoToPage(page: ExtensionsSettingsPage) {
  let newState = get(state);
  newState.page = page;
  state.set(newState);
}
