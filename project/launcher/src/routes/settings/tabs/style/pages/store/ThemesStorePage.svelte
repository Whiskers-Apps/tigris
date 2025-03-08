<script lang="ts">
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import CatIcon from "$lib/icons/cat.svg?component";
  import { onMount } from "svelte";
  import {
    getSelectedValue,
    getSelectValues,
    load,
    onApplyTheme,
    onGoBack,
    onSearchInput,
    setSelectValue,
    state,
  } from "./ThemesStorePageVM";
  import ClearInput from "$lib/components/inputs/ClearInput.svelte";
  import SelectForm from "$lib/components/form/SelectForm.svelte";
  import PersonIcon from "$lib/icons/person.svg?component";
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
        placeholder="Search Themes"
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
      {#each $state.themes as theme}
        <div class="p-4 border border-secondary rounded-lg text-lg space-y-4">
          <SelectForm
            title={theme.name}
            description=""
            value={getSelectedValue(theme)}
            values={getSelectValues(theme)}
            onselect={(selectValue) => {
              setSelectValue(theme, selectValue);
            }}
          />

          <div class="flex space-x-2 items-center">
            <PersonIcon class="w-4 h-4" />

            <p class="flex-1 text">{theme.author}</p>

            <TextButton
              text="Apply"
              disabled={$state.applyingTheme}
              onclick={() => {
                onApplyTheme(theme);
              }}
            />
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
