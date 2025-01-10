<script lang="ts">
  import { onMount } from "svelte";
  import {
    load,
    onShowDeleteDialog,
    onGoBack,
    onKeywordInput,
    onNameInput,
    onQueryInput,
    onSave,
    onCloseDeleteDialog,
    onDelete,
  } from "./EditEnginePageVM";
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import { state } from "./EditEnginePageVM";
  import TextForm from "$lib/components/form/TextForm.svelte";
  import PrimaryButton from "$lib/components/buttons/PrimaryButton.svelte";
  import DangerButton from "$lib/components/buttons/DangerButton.svelte";
  import ConfirmationDialog from "$lib/components/form/ConfirmationDialog.svelte";

  const props = $props<{ id: number }>();

  export const { id } = props;

  onMount(() => {
    load(id);
  });
</script>

{#if !$state.loading}
  <div class="space-y-6">
    <div class="flex items-center space-x-2">
      <BackButton
        onclick={() => {
          onGoBack();
        }}
      />

      <div class="flex-grow"></div>

      <DangerButton text="Delete" onclick={() => onShowDeleteDialog()} />

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

  <ConfirmationDialog
    show={$state.showDeleteDialog}
    title="Delete Search Engine"
    message="Are you sure you want to delete this search engine?"
    oncancel={() => {
      onCloseDeleteDialog();
    }}
    onconfirm={() => {
      onDelete();
    }}
  />
{/if}
