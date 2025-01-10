<script lang="ts">
  import { onMount } from "svelte";
  import { load, state } from "./MainLayoutVM";

  onMount(() => {
    load();
  });
</script>

{#if !$state.loading}
  {@html $state.css}

  <div
    class="bg-background box-radius box-border h-screen w-full flex-grow flex flex-col text-text"
  >
    <slot />
  </div>
{/if}
