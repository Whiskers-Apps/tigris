<script lang="ts">
  import { onMount } from "svelte";
  import { load, onOpenLink, state } from "./AboutPageVM";
  import WhiskersAppsLogo from "$lib/icons/whiskers-apps-logo.svg?component";
  import TextButton from "$lib/components/buttons/TextButton.svelte";

  onMount(() => {
    load();
  });
</script>

{#if !$state.loading}
  <div class="space-y-4">
    <div class="flex items-center justify-center p-4 border rounded-2xl border-secondary space-x-8">
      <WhiskersAppsLogo class="h-20 w-20" />
      <p class="text-2xl">Tigris Launcher</p>
    </div>
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

      <TextButton text="https://github.com/Whiskers-Apps/tigris" onclick={()=>{onOpenLink("https://github.com/Whiskers-Apps/tigris")}}/>
      
    </div>
  </div>
{/if}
