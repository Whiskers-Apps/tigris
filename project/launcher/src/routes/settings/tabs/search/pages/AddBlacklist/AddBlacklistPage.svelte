<script lang="ts">
  import { onMount } from "svelte";
  import { load, onGoBack, onSave, onToggleApp, state } from "./AddBlacklistPageVM";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import PrimaryButton from "$lib/components/buttons/PrimaryButton.svelte";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import FileIcon from "$lib/icons/file.svg?component";

  onMount(() => {
    load();
  });
</script>

{#if !$state.loading}
  <div class="space-y-6 flex flex-col h-full">
    <div class="flex items-center">
      <BackButton
        onclick={() => {
          onGoBack();
        }}
      />

      <div class="flex-grow"></div>

      <PrimaryButton
        text="Save"
        disabled={$state.selectedApps.length === 0}
        onclick={() => onSave()}
      />
    </div>

    <div class="space-y-2 overflow-auto flex-grow">
      {#each $state.apps as app}
        <button
          class={`w-full flex justify-start items-center p-2 border border-secondary rounded-lg space-x-4 ${$state.selectedApps.includes(app.path) ? "bg-secondary" : ""}`}
          onclick={() => {
            onToggleApp(app.path);
          }}
        >
          {#if app.icon_path !== null}
            <img
              class="icon-radius"
              src={convertFileSrc(app.icon_path)}
              alt="icon"
              height="32"
              width="32"
            />
          {:else}
            <FileIcon class="h-[32px] w-[32px] text-accent"/>
          {/if}

          <p>{app.name}</p>
        </button>
      {/each}
    </div>
  </div>
{/if}
