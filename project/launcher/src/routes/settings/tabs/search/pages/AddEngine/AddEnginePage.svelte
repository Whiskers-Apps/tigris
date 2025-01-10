<script lang="ts">
  import { onMount } from "svelte";
  import { clearState } from "../EditEngine/EditEnginePageVM";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import PrimaryButton from "$lib/components/buttons/PrimaryButton.svelte";
  import { onGoBack, onKeywordInput, onNameInput, onQueryInput, onSave } from "./AddEnginePageVM";
  import { state } from "./AddEnginePageVM";
  import TextForm from "$lib/components/form/TextForm.svelte";

  onMount(() => {
    clearState();
  });
</script>

<div class="space-y-6">
  <div class="flex items-center">
    <BackButton
      onclick={() => {
        onGoBack();
      }}
    />

    <div class="flex-grow"></div>

    <PrimaryButton text="Save" disabled={$state.disableSaveButton} onclick={() => onSave()} />
  </div>

  <TextForm
    title="Keyword"
    description="Use this keyword to directly search with this search engine"
    placeholder="ds"
    value={$state.keyword}
    errorMessage={$state.keywordError}
    oninput={(value) => onKeywordInput(value)}
  />

  <TextForm
    title="Name"
    description="The search engine name"
    placeholder="DuckDuckGo"
    value={$state.name}
    errorMessage={$state.nameError}
    oninput={(value) => onNameInput(value)}
  />

  <TextForm
    title="Query"
    description="The search engine query. Requires a %s for the search text"
    placeholder="https://duckduckgo.com/?q=%s"
    value={$state.query}
    errorMessage={$state.queryError}
    oninput={(value) => onQueryInput(value)}
  />
</div>
