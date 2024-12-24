<script lang="ts">
  import HorizontalDivider from "$lib/components/components/HorizontalDivider.svelte";
  import ClearInput from "$lib/components/inputs/ClearInput.svelte";
  import { onMount } from "svelte";
  import MainLayout from "../lib/components/layouts/MainLayout.svelte";
  import { getColorFilter, load, onSearchInput, state } from "./MainVM";
  import CatIcon from "$lib/icons/cat.svg?component";
  import { convertFileSrc } from "@tauri-apps/api/core";

  onMount(() => {
    load();
  });
</script>

<MainLayout>
  <div class="flex flex-col h-screen">
    <div class="p-6">
      <ClearInput
        placeholder="Search for apps, web and extensions"
        value={$state.searchText}
        on:input={(e) => {
          onSearchInput(e.detail);
        }}
      />
    </div>

    <HorizontalDivider />

    <div class="flex-grow w-full p-4 flex flex-col justify-center">
      {#if $state.totalResultsCount === 0}
        <div class="flex flex-col h-full items-center justify-center">
          <CatIcon />
          <p>No Results</p>
        </div>
      {/if}

      <div class="w-full flex-grow ">
        {#each $state.results as result, index}
          <div
            class={`h-[60px] p-4 flex items-center rounded-lg space-x-4 ${$state.selectedIndex === index ? "bg-secondary" : ""}`}
          >
            {#if result.icon_path !== null}
              <img
                src={convertFileSrc(result.icon_path)}
                alt="icon"
                height="32"
                width="32"
                style="filter: {result.icon_color === 'accent'
                  ? $state.accentFilter
                  : getColorFilter(result.icon_color)}"
              />
            {/if}
            <div class="flex-grow">
              <p class="">{result.title}</p>

              {#if result.description !== null}
                <p class=" text-[0.8rem] text-secondary">{result.description}</p>
              {/if}
            </div>
            <p class="text-accent">Alt + {index + 1}</p>
          </div>
        {/each}
      </div>
    </div>

    {#if $state.totalResultsCount > 0}
      <HorizontalDivider />
      
      <div class="p-6">
        <p>Results: {$state.totalResultsCount}</p>
      </div>
    {/if}
  </div>
</MainLayout>
