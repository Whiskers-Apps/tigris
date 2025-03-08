<script lang="ts">
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import ClearInput from "$lib/components/inputs/ClearInput.svelte";
  import { load, onGoBack, onInstallExtension, onSearchInput, state } from "./ExtensionsStorePageVM";
  import CatIcon from "$lib/icons/cat.svg?component";
  import PersonIcon from "$lib/icons/person.svg?component";
  import { onMount } from "svelte";
  import TextButton from "$lib/components/buttons/TextButton.svelte";

  onMount(() => {
    load();
  });
</script>

<div class="flex flex-col h-full space-y-4">
  <div class="flex items-center space-x-4">
    <BackButton
      onclick={() => {
        onGoBack();
      }}
    />

    {#if !$state.loading}
      <ClearInput
        placeholder="Search Extensions"
        value={$state.searchValue}
        oninput={(value) => {
          onSearchInput(value);
        }}
      />
    {/if}
  </div>
  {#if $state.loading}
    <div class="flex-1 w-full justify-center items-center flex flex-col">
      <CatIcon />
      <p>Loading</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each $state.extensions as extension}
        <div class="p-4 border border-secondary rounded-lg text-lg space-y-4">
          <div class=" space-x-2 items-center">
            <div class="">
              <h3 class="text-xl font-semibold">{extension.name}</h3>

              <p class="text-secondary">{extension.description}</p>
            </div>

            <div class="flex mt-4 space-x-2">
              <PersonIcon class="w-6 h-6" />

              <p class="flex-1">{extension.author}</p>

              {#if !$state.installedExtensions.includes(extension.id)}
                <TextButton
                  text="Install"
                  disabled={$state.installingExtension}
                  onclick={() => {onInstallExtension(extension)}}
                />
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
