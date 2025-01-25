<script lang="ts">
  import { onMount } from "svelte";
  import {
    canShowSetting,
    getSelectValue,
    getSelectValues,
    getSettingValue,
    load,
    onOpenExtensionsDir,
    onOpenStore,
    onSetSettingValue,
    state,
  } from "./ExtensionsMainPageVM";
  import HorizontalDivider from "$lib/components/components/HorizontalDivider.svelte";
  import TextButton from "$lib/components/buttons/TextButton.svelte";
  import TextForm from "$lib/components/form/TextForm.svelte";
  import SelectForm from "$lib/components/form/SelectForm.svelte";
  import type { SelectValue } from "$lib/components/form/helper-classes/SelectValue";
  import SwitchForm from "$lib/components/form/SwitchForm.svelte";
  import SliderForm from "$lib/components/form/SliderForm.svelte";

  onMount(() => {
    load();
  });
</script>

{#if !$state.loading}
  <div class="flex space-x-4">
    <TextButton
      text="Store"
      onclick={() => {
        onOpenStore();
      }}
    />
    <TextButton text="Refresh" onclick={() => {}} />
    <TextButton
      text="Folder"
      onclick={() => {
        onOpenExtensionsDir();
      }}
    />
  </div>
  <div class="space-y-6 mt-4">
    {#each $state.extensions as extension}
      <div class=" border-secondary border rounded-2xl p-4 space-y-4">
        <div class="">
          <h3 class="text-xl font-semibold">{extension.name}</h3>
          <p class="text-secondary">{extension.description}</p>
        </div>

        <div class="mt-2 mb-2">
          <HorizontalDivider />
        </div>

        <div></div>

        <div class="space-y-6">
          <TextForm
            title="Keyword"
            description="The extension keyword"
            placeholder="No Keyword !!!"
            value={getSettingValue(extension.id, "keyword")}
            oninput={(value: string) => onSetSettingValue(extension.id, "keyword", value)}
          />

          {#each extension.settings as setting}
            {#if canShowSetting(extension.id, setting.id)}
              {#if setting.setting_type === "Text"}
                <TextForm
                  title={setting.name}
                  description={setting.description}
                  value={getSettingValue(extension.id, setting.id)}
                  oninput={(value: string) => onSetSettingValue(extension.id, setting.id, value)}
                />
              {/if}

              {#if setting.setting_type === "Select"}
                <SelectForm
                  title={setting.name}
                  description={setting.description}
                  value={getSelectValue(extension.id, setting.id)}
                  values={getSelectValues(extension.id, setting.id)}
                  onselect={(value: SelectValue) =>
                    onSetSettingValue(extension.id, setting.id, value.id)}
                />
              {/if}

              {#if setting.setting_type === "Switch"}
                <SwitchForm
                  title={setting.name}
                  description={setting.description}
                  value={getSettingValue(extension.id, setting.id) === "true" ? true : false}
                  onswitch={(value) => {
                    onSetSettingValue(extension.id, setting.id, value.toString());
                  }}
                />
              {/if}

              {#if setting.setting_type === "Slider"}
                <SliderForm
                  title={setting.name}
                  description={setting.description}
                  min={setting.min!!}
                  max={setting.max!!}
                  step={setting.step!!}
                  value={+getSettingValue(extension.id, setting.id)}
                  onslide={(value) => {
                    onSetSettingValue(extension.id, setting.id, value.toString());
                  }}
                />
              {/if}
            {/if}
          {/each}
        </div>

        <div class="flex justify-end space-x-4">
          <TextButton text="Update" onclick={() => {}} />

          <TextButton text="Uninstall" danger={true} onclick={() => {}} />
        </div>
      </div>
    {/each}
  </div>
{/if}
