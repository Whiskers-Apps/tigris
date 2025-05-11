<script lang="ts">
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import HeaderTitle from "$lib/components/components/HeaderTitle.svelte";
  import HorizontalDivider from "$lib/components/components/HorizontalDivider.svelte";
  import ClearInput from "$lib/components/inputs/ClearInput.svelte";
  import MainLayout from "$lib/components/layouts/MainLayout.svelte";
  import { onMount } from "svelte";
  import { load, onGoBack, onSelectTab, state } from "./SettingsVM";
  import AboutPage from "./tabs/about/AboutPage.svelte";
  import ExtensionsPage from "./tabs/extensions/ExtensionsPage.svelte";
  import SearchPage from "./tabs/search/SearchPage.svelte";
  import StylePage from "./tabs/style/pages/StylePage.svelte";

  onMount(() => {
    load();
  });
</script>

<MainLayout>
  <div class="flex flex-col h-[700px] overflow-hidden">
    <div class="flex p-6 space-x-4">
      <BackButton onclick={() => onGoBack()} />

      <HeaderTitle title="Settings" />
    </div>

    <HorizontalDivider />

    <div class="flex flex-1 min-h-0">
      <div class="navbar w-fit overflow-auto p-4 navbar-border space-y-1">
        <button
          class={`${$state.activeTab === 0 ? "tab active-tab" : "tab"}`}
          onclick={() => onSelectTab(0)}
        >
          <p>About</p>
        </button>

        <button
          class={`${$state.activeTab === 1 ? "tab active-tab" : "tab"}`}
          onclick={() => onSelectTab(1)}
        >
          <p>Search</p>
        </button>

        <button
          class={`${$state.activeTab === 2 ? "tab active-tab" : "tab"}`}
          onclick={() => onSelectTab(2)}
        >
          <p>Style</p>
        </button>

        <button
          class={`${$state.activeTab === 3 ? "tab active-tab" : "tab"}`}
          onclick={() => onSelectTab(3)}
        >
          <p>Extensions</p>
        </button>
      </div>
      <div
        class="flex-1 overflow-auto break-all p-4 min-h-0"
        id="settings-page"
      >
        {#if $state.activeTab === 0}
          <AboutPage />
        {/if}
        {#if $state.activeTab === 1}
          <SearchPage />
        {/if}
        {#if $state.activeTab === 2}
          <StylePage />
        {/if}
        {#if $state.activeTab === 3}
          <ExtensionsPage />
        {/if}
      </div>
    </div>
  </div>
</MainLayout>

<style scoped>
  .navbar-border {
    border-right: 1px solid var(--secondary-background);
  }

  .navbar {
    width: 240px;
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
