import { get, writable } from "svelte/store";

type State = {
  page: Page;
};

export enum Page {
  MAIN,
  STORE,
}

export const state = writable<State>({
  page: Page.MAIN,
});

export function onGoToPage(page: Page) {
  let newState = get(state);
  newState.page = page;
  state.set(newState);
}
