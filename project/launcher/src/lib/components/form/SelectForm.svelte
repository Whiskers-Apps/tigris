<script lang="ts">
  import type { SelectValue } from "./helper-classes/SelectValue";
  import ChevronDown from "$lib/icons/chevron-down.svg?component";
  import ChevronUp from "$lib/icons/chevron-up.svg?component";
  import HorizontalDivider from "../components/HorizontalDivider.svelte";

  type Props = {
    title: string;
    description: string;
    value: SelectValue;
    values: SelectValue[];
    onselect: (selectValue: SelectValue) => void;
  };

  const { title, description, value = $bindable(), values, onselect }: Props = $props();

  let showOptions = $state(false);

  function toggleShowOptions() {
    showOptions = !showOptions;
  }

  function select(selectValue: SelectValue) {
    onselect(selectValue);
    showOptions = false;
  }
</script>

<div>
  <h3 class="text-xl font-semibold">{title}</h3>

  <p class="text-secondary">{description}</p>

  <div class="select">
    <button class=" w-full items-center flex gap-4 p-2" onclick={toggleShowOptions}>
      <p class=" flex-1 text-start">{value.text}</p>
      {#if showOptions}
        <ChevronUp class=" h-3 w-3" />
      {:else}
        <ChevronDown class=" h-3 w-3" />
      {/if}
    </button>
    {#if showOptions}
      <HorizontalDivider useBackgroundColor={true} />

      <div class=" flex flex-col">
        {#each values as selectValue}
          <button
            class={`w-full flex items-start hover-bg-secondary p-2 ${selectValue.id === value.id ? " bg-secondary" : ""}`}
            onclick={() => {
              select(selectValue);
            }}>{selectValue.text}</button
          >
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .select {
    background-color: var(--background);
    border: 1px solid var(--secondary-background);
    border-radius: 8px;
    width: 100%;
  }
</style>
