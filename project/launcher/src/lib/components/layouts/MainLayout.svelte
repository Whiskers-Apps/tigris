<script lang="ts">
  import { onMount } from "svelte";
  import { load, state } from "./MainLayoutVM";

  onMount(async () => {
    load();
  });
</script>

{#if !$state.loading}
  {@html $state.css}
  <div class=" h-screen flex items-top">
    <div
      class="bg-background box-radius box-border flex-1 flex flex-col text-text main-content h-fit"
    >
      <slot />
    </div>
  </div>
{/if}
