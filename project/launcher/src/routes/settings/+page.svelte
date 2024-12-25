<script lang="ts">
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import HeaderTitle from "$lib/components/components/HeaderTitle.svelte";
  import HorizontalDivider from "$lib/components/components/HorizontalDivider.svelte";
  import ClearInput from "$lib/components/inputs/ClearInput.svelte";
  import MainLayout from "$lib/components/layouts/MainLayout.svelte";
  import { onMount } from "svelte";
  import { load, onGoBack, onSelectTab, state } from "./SettingsVM";
  import AboutPage from "./tabs/about/AboutPage.svelte";

  onMount(() => {
    load();
  });
</script>

<MainLayout>
  <div class="flex flex-col h-full">
    <div class="p-6 flex space-x-4">
      <BackButton
        onclick={() => onGoBack()}
      />

      <HeaderTitle title="Settings" />
    </div>

    <HorizontalDivider />

    <div class="flex flex-grow">
      <div class="w-[240px] p-2 navbar-border space-y-2">
        <button
          class={$state.activeTab === 0 ? "active-tab tab" : "tab"}
          onclick={() => onSelectTab(0)}
        >
          <p>About</p>
        </button>

        <button
          class={$state.activeTab === 1 ? "active-tab tab" : "tab"}
          onclick={() => onSelectTab(1)}
        >
          <p>Search</p>
        </button>

        <button
          class={$state.activeTab === 2 ? "active-tab tab" : "tab"}
          onclick={() => onSelectTab(2)}
        >
          <p>Style</p>
        </button>

        <button
          class={$state.activeTab === 3 ? "active-tab tab" : "tab"}
          onclick={() => onSelectTab(3)}
        >
          <p>Extensions</p>
        </button>
      </div>
      <div class="flex-grow p-2">
        {#if $state.activeTab === 0}
          <AboutPage/>
        {/if}
      </div>
    </div>
  </div>
</MainLayout>

<style scoped>
  .navbar-border {
    border-right: 1px solid var(--secondary-background);
  }

  .tab {
    width: 100%;
    text-align: start;
    padding: 8px 12px 8px 12px;
    border-radius: 8px;
  }

  .active-tab,
  .tab:hover {
    background-color: var(--secondary-background);
  }
</style>
