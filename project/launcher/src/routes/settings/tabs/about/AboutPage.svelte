<script lang="ts">
  import { onMount } from "svelte";
  import { load, onOpenLink, state } from "./AboutPageVM";

  onMount(() => {
    load();
  });
</script>

{#if !$state.loading}
  <div class="space-y-4">
    <div>
        <p class=" font-medium text-lg">Version</p>
        <p class="text-secondary">{$state.version}</p>
    </div>

    <div>
        <p class=" font-medium text-lg">Extensions</p>
        <p class="text-secondary">{$state.extensionCount}</p>
    </div>

    <div>
        <p class=" font-medium text-lg">Source Code</p>
        <button class=" hover:underline" onclick={() => onOpenLink("https://github.com/Whiskers-Apps/tigris")}>
            <p class="text-secondary">https://github.com/Whiskers-Apps/tigris</p>
        </button>
    </div>
  </div>
{/if}
