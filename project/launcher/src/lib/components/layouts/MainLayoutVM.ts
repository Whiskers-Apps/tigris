import type { Settings } from "$lib/features/Settings";
import { get, writable } from "svelte/store";
import { getSettings, load as loadSettings } from "$lib/repositories/SettingsRepository";
export const state = writable({
  loading: true,
  css: "",
});

export async function load() {
  await loadSettings();

  let newState = get(state);

  newState.loading = false;
  newState.css = getCss(getSettings());

  state.set(newState);
}

export function refreshCSS() {
  let newState = get(state);
  newState.css = getCss(getSettings());
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
    --box-border-width: ${settings.border_width}px;
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

.bg-danger{
    background-color: var(--danger);
}

.bg-background{
    background-color: var(--background);
}

.bg-secondary{
    background-color: var(--secondary-background);
}

.hover-bg-secondary:hover{
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

.box-border{
    /*border: var(--box-border-width) solid var(${
      settings.accent_border ? "--accent" : "bg-secondary"
    });*/
    border: var(--box-border-width) solid var(${
      settings.accent_border ? "--accent" : "--secondary-background"
    });
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

.text-danger{
    color: var(--danger);
}

.text-on-danger{
    color: var(--on-danger);
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
