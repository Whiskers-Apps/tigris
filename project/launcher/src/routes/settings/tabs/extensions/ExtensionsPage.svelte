<script lang="ts">
  import { state, Page } from "./ExtensionsPageVM";
  import MainPage from "./pages/main/ExtensionsMainPage.svelte";
  import StorePage from "./pages/store/ExtensionsStore.svelte";
</script>

{#if $state.page == Page.MAIN}
  <MainPage />
{/if}

{#if $state.page == Page.STORE}
  <StorePage />
{/if}
