<script lang="ts">
  import BackButton from "$lib/components/buttons/BackButton.svelte";
  import HeaderTitle from "$lib/components/components/HeaderTitle.svelte";
  import HorizontalDivider from "$lib/components/components/HorizontalDivider.svelte";
  import MainLayout from "$lib/components/layouts/MainLayout.svelte";
  import { onMount } from "svelte";
  import {
    getSelectValue,
    getSelectValues,
    load,
    onGoBack,
    onSetFieldValue,
    onWriteForm,
    state,
  } from "./FormVM";
  import TextForm from "$lib/components/form/TextForm.svelte";
  import PrimaryButton from "$lib/components/buttons/PrimaryButton.svelte";
  import SelectForm from "$lib/components/form/SelectForm.svelte";
  import TextAreaForm from "$lib/components/form/TextAreaForm.svelte";
  import SwitchForm from "$lib/components/form/SwitchForm.svelte";
  import SliderForm from "$lib/components/form/SliderForm.svelte";
  import FileSystemForm from "$lib/components/form/FileSystemForm.svelte";

  onMount(() => {
    load();
  });
</script>

<MainLayout>
  <div class="flex flex-col h-full">
    <div class="flex p-6 space-x-4">
      <BackButton
        onclick={() => {
          onGoBack();
        }}
      />

      <HeaderTitle title={$state.form.title} />
    </div>

    <HorizontalDivider />

    <div class="p-4 flex-grow overflow-auto space-y-6">
      {#each $state.form.fields as field}
        <div>
          {#if field.field_type === "Text"}
            <TextForm
              title={field.title}
              description={field.description}
              placeholder={field.text_field!!.placeholder ?? ""}
              value={field.text_field!!.value}
              number={field.text_field!!.validation?.only_numbers ?? false}
              maxCharacters={field.text_field!!.validation?.max_characters ?? null}
              oninput={(value) => {
                onSetFieldValue(field.id, value);
              }}
            />
          {/if}
          {#if field.field_type === "TextArea"}
            <TextAreaForm
              title={field.title}
              description={field.description}
              placeholder={field.text_area_field!!.placeholder ?? ""}
              value={field.text_area_field!!.value}
              oninput={(value) => {
                onSetFieldValue(field.id, value);
              }}
            />
          {/if}
          {#if field.field_type === "Select"}
            <SelectForm
              title={field.title}
              description={field.description}
              value={getSelectValue(field.select_field!!)}
              values={getSelectValues(field.select_field!!)}
              onselect={(value) => onSetFieldValue(field.id, value.id)}
            />
          {/if}
          {#if field.field_type === "Switch"}
            <SwitchForm
              title={field.title}
              description={field.description}
              value={field.switch_field!!.value}
              onswitch={(value) => onSetFieldValue(field.id, value.toString())}
            />
          {/if}
          {#if field.field_type === "Slider"}
            <SliderForm
              title={field.title}
              description={field.description}
              min={field.slider_field!!.min_value}
              max={field.slider_field!!.max_value}
              step={field.slider_field!!.step}
              value={field.slider_field!!.value}
              onslide={(value) => onSetFieldValue(field.id, value.toString())}
            />
          {/if}
          {#if field.field_type === "FileSystem"}
            <FileSystemForm
              title={field.title}
              description={field.description}
              dir={field.file_system_field!!.pick_directory}
              filters={field.file_system_field!!.filters}
              value={field.file_system_field!!.value}
              onchange={(value) => onSetFieldValue(field.id, value)}
            />
          {/if}
        </div>
      {/each}
    </div>

    <HorizontalDivider />

    <div class="p-6 flex justify-end">
      <PrimaryButton
        text={$state.form.button_text}
        onclick={() => {
          onWriteForm();
        }}
        disabled={$state.disableButton}
      />
    </div>
  </div>
</MainLayout>
