<script lang="ts">
  import { onMount } from "svelte";
  import { load, state } from "./MainLayoutVM";

  onMount(() => {
    load();
  });
</script>

{#if !$state.loading}
  {@html $state.css}

  <div class="w-full h-screen box-radius border border-secondary text-text overflow-clip">
    <div class="w-full h-full overflow-clip bg-background">
      <slot />
    </div>
  </div>
{/if}
