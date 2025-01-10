import { get, writable } from "svelte/store";

export const Pages = {
  MAIN: "main",
  ADD_ENGINE: "add-engine",
  EDIT_ENGINE: "edit-engine",
  ADD_BLACKLIST: "add-blacklist",
};

export const state = writable({
  page: Pages.MAIN,
  editingEngineId: -1,
});

export function setMainPage() {
  let newState = get(state);
  newState.page = Pages.MAIN;
  state.set(newState);
}
