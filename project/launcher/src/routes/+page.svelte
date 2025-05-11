<script lang="ts">
  import HorizontalDivider from "$lib/components/components/HorizontalDivider.svelte";
  import ClearInput from "$lib/components/inputs/ClearInput.svelte";
  import { onMount } from "svelte";
  import MainLayout from "../lib/components/layouts/MainLayout.svelte";
  import {
    getColorFilter,
    load,
    onResultHover,
    onSearchInput,
    onSelectResult,
    state,
  } from "./MainVM";
  import CatIcon from "$lib/icons/cat.svg?component";
  import WarningIcon from "$lib/icons/warning.svg?component";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { getUpperCasedFirstLetter } from "$lib/utils/TextFormatting";
  import { settings } from "$lib/repositories/SettingsRepository";

  onMount(() => {
    load();
  });
</script>

<MainLayout>
  <div class="flex flex-col flex-1">
    <div class="p-5 pl-6 pr-6">
      <ClearInput
        placeholder="Search for apps, web and extensions"
        value={$state.searchText}
        oninput={(value) => {
          onSearchInput(value);
        }}
        id="search"
      />
    </div>

    <HorizontalDivider />

    <div class="flex-1 w-full p-4 flex flex-col justify-center">
      {#if $state.totalResultsCount === 0}
        <div class="flex h-full items-center justify-center space-x-2">
          <CatIcon class="h-10 w-10" />
          <p>No Results</p>
        </div>
      {/if}

      <div class="w-full flex-1">
        {#each $state.results as result, index}
          {#if $state.askConfirmation && $state.selectedIndex === index}
            <div
              class="h-[60px] w-full p-4 flex items-center result-radius space-x-4 bg-danger text-on-danger font-bold"
            >
              <WarningIcon class="h-[32px] w-[32px]" />
              <p>Confirm Action</p>
            </div>
          {:else}
            <button
              class={`h-[60px] w-full p-4 flex items-center result-radius space-x-4 ${$state.selectedIndex === index ? "bg-secondary" : ""}`}
              onmouseover={() => {
                onResultHover(index);
              }}
              onfocus={() => {}}
              onclick={() => {
                onSelectResult(index);
              }}
            >
              {#if result.icon_path !== null}
                <img
                  class="icon-radius flex-shrink-0"
                  src={convertFileSrc(result.icon_path)}
                  alt="icon"
                  height="32"
                  width="32"
                  style="filter: {result.icon_color === 'accent'
                    ? $state.accentFilter
                    : getColorFilter(result.icon_color)}"
                />
              {/if}
              <div class="flex-1 overflow-hidden text-start min-w-0">
                <p class="">{result.title}</p>

                {#if result.description !== null}
                  <p class=" text-[0.8rem]">{result.description}</p>
                {/if}
              </div>
              {#if $settings.show_shortcut_hint}
                <p class="text-accent flex-shrink-0">
                  {getUpperCasedFirstLetter($settings.shortcut_key)} + {index +
                    1}
                </p>
              {/if}
            </button>
          {/if}
        {/each}
      </div>
    </div>

    {#if $state.totalResultsCount > 1}
      <HorizontalDivider />

      <div class="p-5 pl-6 pr-6">
        <p>Results: {$state.totalResultsCount}</p>
      </div>
    {/if}
  </div>
</MainLayout>
