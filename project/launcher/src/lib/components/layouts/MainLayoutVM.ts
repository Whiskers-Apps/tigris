import { getSettings, type Settings, type Theme } from "$lib/features/Settings";
import { get, writable } from "svelte/store";

export const state = writable({
  loading: true,
  settings: {} as Settings,
  css: "",
});

export async function load() {
  let newState = get(state);

  newState.settings = await getSettings();
  newState.css = getCss(newState.settings);
  newState.loading = false;

  state.set(newState);
}

function getCss(settings: Settings): string {
  return `
<style>

:root{
    --accent: ${settings.theme.accent};
    --on-accent: ${settings.theme.on_accent};
    --danger: ${settings.theme.danger};
    --on-danger: ${settings.theme.on_danger};
    --background: ${settings.theme.background};
    --secondary-background: ${settings.theme.secondary_background};
    --tertiary-background: ${settings.theme.tertiary_background};
    --text: ${settings.theme.text};
    --secondary-text: ${settings.theme.secondary_text};
    --tertiary-text: ${settings.theme.tertiary_text};
    --disabled-text: ${settings.theme.disabled_text};
    --box-radius: ${settings.box_border_radius}px;
    --result-radius: ${settings.result_border_radius}px;
    --icon-radius: ${settings.icon_border_radius}px;
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

.border-accent{
    border-color: var(--accent);
}

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

.text-on-accent{
    color: var(--on-accent);
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

/* 
======================================================
==== Border Radius
====================================================== 
*/

.box-radius{
    border-radius: var(--box-radius);
}

.result-radius{
    border-radius: var(--result-radius);
}

.icon-radius{
    border-radius: var(--icon-radius);
}

</style>
`;
}
