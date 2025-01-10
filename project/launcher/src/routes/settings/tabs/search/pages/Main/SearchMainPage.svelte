<script lang="ts">
  import SwitchForm from "$lib/components/form/SwitchForm.svelte";
  import SelectForm from "$lib/components/form/SelectForm.svelte";
  import TextButton from "$lib/components/buttons/TextButton.svelte";
  import SearchIcon from "$lib/icons/search.svg?component";
  import { settings } from "$lib/repositories/SettingsRepository";
  import {
    asSelectValue,
    getShortcutKeys,
    load,
    onOpenAddBlacklistPage,
    onOpenAddEnginePage,
    onOpenEditEnginePage,
    onSetHideAppIcons,
    onSetShortcutKey,
    onSetShowRecentApps,
    onSetShowShortcutHint,
    removeFromBlacklist,
    state,
  } from "./SearchMainPageVM";
  import { onMount } from "svelte";
  import FileIcon from "$lib/icons/file.svg?component";
  import { convertFileSrc } from "@tauri-apps/api/core";

  onMount(() => {
    load();
  });
</script>

{#if !$state.loading}
  <div class="space-y-8">
    <SwitchForm
      title="Show Recent Apps"
      description="Show recent apps when there's no text in the input"
      value={$settings.show_recent_apps}
      onswitch={(value) => {
        onSetShowRecentApps(value);
      }}
    />

    <SwitchForm
      title="Hide App Icons"
      description="Hide app icons"
      value={$settings.hide_app_icons}
      onswitch={(value) => {
        onSetHideAppIcons(value);
      }}
    />

    <SwitchForm
      title="Show Shortcut Hint"
      description="Show the shortcut hint on the search result"
      value={$settings.show_shortcut_hint}
      onswitch={(value) => {
        onSetShowShortcutHint(value);
      }}
    />

    <SelectForm
      title="Shortcut Key"
      description="The shortcut key to quickly run a result"
      value={asSelectValue($settings.shortcut_key)}
      values={getShortcutKeys()}
      onselect={(value) => {
        onSetShortcutKey(value);
      }}
    />

    <div class=" rounded-lg space-y-2">
      <div class="flex">
        <h3 class="text-xl font-semibold">Search Engines</h3>

        <div class="flex-grow"></div>

        <TextButton text="Add" onclick={() => onOpenAddEnginePage()} />
      </div>

      <div class="space-y-2">
        {#each $settings.search_engines as searchEngine}
          <button
            class="border-button hover-bg-secondary w-full flex border border-secondary p-2 items-center rounded-lg space-x-2"
            onclick={() => onOpenEditEnginePage(searchEngine.id)}
          >
            <SearchIcon class="h-5 w-5" />

            <div>{searchEngine.name}</div>

            <div class="flex-grow"></div>

            <div class="p-1 pl-2 pr-2 bg-secondary rounded-md">{searchEngine.keyword}</div>
          </button>
        {/each}
      </div>
    </div>

    <div>
      <div class="flex">
        <h3 class="text-xl font-semibold">Blacklist</h3>

        <div class="flex-grow"></div>

        <TextButton
          text="Add"
          onclick={() => {
            onOpenAddBlacklistPage();
          }}
        />
      </div>

      <div>
        {#if $state.blacklisted_apps.length === 0}
          <p class="text-secondary">No blacklisted apps. Click on the add button to add apps</p>
        {/if}

        <div class="space-y-2 mt-2">
          {#each $state.blacklisted_apps as app}
            <div class="flex space-x-4 p-2 border border-secondary rounded-lg items-center">
              {#if app.icon_path !== null}
                <img
                  class="icon-radius"
                  src={convertFileSrc(app.icon_path)}
                  alt="icon"
                  height="32"
                  width="32"
                />
              {:else}
                <FileIcon class="h-[32px] w-[32px] text-accent" />
              {/if}

              <p>{app.name}</p>

              <div class="flex-grow"></div>

              <TextButton
                text="Remove"
                danger={true}
                onclick={() => {
                  removeFromBlacklist(app.path);
                }}
              />
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}
