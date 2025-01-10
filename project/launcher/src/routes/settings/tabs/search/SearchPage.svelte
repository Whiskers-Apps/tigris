<script lang="ts">
  import { Pages, state } from "./SearchPageVM";
  import SearchMainPage from "./pages/Main/SearchMainPage.svelte";
  import AddEnginePage from "./pages/AddEngine/AddEnginePage.svelte";
  import EditEnginePage from "./pages/EditEngine/EditEnginePage.svelte";
  import AddBlacklistPage from "./pages/AddBlacklist/AddBlacklistPage.svelte";
</script>

{#if $state.page === Pages.MAIN}
  <SearchMainPage />
{/if}

{#if $state.page === Pages.ADD_ENGINE}
  <AddEnginePage />
{/if}

{#if $state.page === Pages.EDIT_ENGINE}
  <EditEnginePage id={$state.editingEngineId} />
{/if}

{#if $state.page === Pages.ADD_BLACKLIST}
  <AddBlacklistPage />
{/if}
