import { get, writable } from "svelte/store";

export const state = writable({
  loading: true,
  css: "",
});

export function load() {
  let newState = get(state);

  newState.css = getCss();
  newState.loading = false;

  state.set(newState);
}

function getCss(): string {
  return `
<style>

:root{
    --accent: #FFE072;
    --background: #0E0600;
    --secondary-background: #301300;
    --tertiary-background: #1B0B00;
    --text: #FFEEE2;
    --secondary-text: #E5D2C5;
    --tertiary-text: #CFBBAD;
    --disabled-text: #B5A8A0;
}

/* 
======================================================
==== Background Colors
====================================================== 
*/

.bg-accent{
    background-color: var(--accent);
}

.bg-background{
    background-color: var(--background);
}

.bg-secondary{
    background-color: var(--secondary-background);
}

.bg-tertiary{
    background-color: var(--tertiary-background);
}


/* 
======================================================
==== Border Colors
====================================================== 
*/

.border-secondary{
    border-color: var(--secondary-background);
}


/* 
======================================================
==== Text Colors
====================================================== 
*/

.text-accent{
    color: var(--accent);
}

.text-text{
    color: var(--text);
}

.text-secondary{
    color: var(--secondary-text);
}

.text-tertiary{
    color: var(--tertiary-text);
}

.text-disabled{
    color: var(--disabled-text);
}

</style>
`;
}
