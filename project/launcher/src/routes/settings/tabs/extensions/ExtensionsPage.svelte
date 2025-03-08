<script lang="ts">
  import { state, ExtensionsSettingsPage } from "./ExtensionsPageVM";
  import MainPage from "./pages/main/ExtensionsMainPage.svelte";
  import StorePage from "./pages/store/ExtensionsStorePage.svelte";
</script>

{#if $state.page == ExtensionsSettingsPage.MAIN}
  <MainPage />
{/if}

{#if $state.page == ExtensionsSettingsPage.STORE}
  <StorePage />
{/if}
