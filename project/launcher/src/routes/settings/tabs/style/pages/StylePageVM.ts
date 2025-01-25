import { get, writable } from "svelte/store";

type StylePageVM = {
  page: StyleSettingsPage;
};

export enum StyleSettingsPage {
  MAIN,
  STORE,
}

export const state = writable<StylePageVM>({
  page: StyleSettingsPage.MAIN,
});

export function onGoToPage(page: StyleSettingsPage) {
  let newState = get(state);
  newState.page = page;
  state.set(newState);
}
