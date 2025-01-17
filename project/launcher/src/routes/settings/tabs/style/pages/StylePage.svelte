<script lang="ts">
  import { state, StyleSettingsPage } from "./StylePageVM";
  import StyleMainPage from "./main/StyleMainPage.svelte";
  import ThemesStorePage from "./store/ThemesStorePage.svelte";
</script>

{#if $state.page == StyleSettingsPage.MAIN}
  <StyleMainPage />
{/if}

{#if $state.page == StyleSettingsPage.STORE}
  <ThemesStorePage />
{/if}
