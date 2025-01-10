<script lang="ts">
  import TextButton from "$lib/components/buttons/TextButton.svelte";
  import HorizontalDivider from "$lib/components/components/HorizontalDivider.svelte";
  import SliderForm from "$lib/components/form/SliderForm.svelte";
  import SwitchForm from "$lib/components/form/SwitchForm.svelte";
  import ColorInput from "$lib/components/inputs/ColorInput.svelte";
  import { settings } from "$lib/repositories/SettingsRepository";
  import {
    onExportTheme,
    onImportTheme,
    onSetAccentBorder,
    onSetAccentColor,
    onSetBackgroundColor,
    onSetBoxBorderRadius,
    onSetBoxBorderWidth,
    onSetDangerColor,
    onSetDisabledTextColor,
    onSetIconBorderRadius,
    onSetOnAccentColor,
    onSetOnDangerColor,
    onSetResultBorderRadius,
    onSetSecondaryBackgroundColor,
    onSetSecondaryTextColor,
    onSetTertiaryBackgroundColor,
    onSetTertiaryTextColor,
    onSetTextColor,
  } from "./StylePageVM";
</script>

<div class="space-y-6">
  <SliderForm
    title="Box Border Radius"
    description="The roundness of the search box"
    max={32}
    min={0}
    step={1}
    value={$settings.box_border_radius}
    onslide={(value) => {
      onSetBoxBorderRadius(value);
    }}
  />

  <SliderForm
    title="Border Width"
    description="The border width of the search box"
    max={6}
    min={0}
    step={1}
    value={$settings.border_width}
    onslide={(value) => {
      onSetBoxBorderWidth(value);
    }}
  />

  <SwitchForm
    title="Accent Border"
    description="Use accent color on the search box border"
    value={$settings.accent_border}
    onswitch={(value) => {
      onSetAccentBorder(value);
    }}
  />

  <SliderForm
    title="Result Border Radius"
    description="The roundness of the result"
    max={32}
    min={0}
    step={1}
    value={$settings.result_border_radius}
    onslide={(value) => {
      onSetResultBorderRadius(value);
    }}
  />

  <SliderForm
    title="Icon Border Radius"
    description="The roundness of the icons"
    max={32}
    min={0}
    step={1}
    value={$settings.icon_border_radius}
    onslide={(value) => {
      onSetIconBorderRadius(value);
    }}
  />

  <div></div>

  <div class="space-y-2">
    <h3 class="text-lg font-semibold">Theme</h3>

    <div class="flex space-x-4">
      <TextButton text="Store" onclick={() => {}} />
      
      <TextButton
        text="Import"
        onclick={() => {
          onImportTheme();
        }}
      />

      <TextButton
        text="Export"
        onclick={() => {
          onExportTheme();
        }}
      />
    </div>

    <HorizontalDivider />

    <div class="space-y-6">
      <div>
        <h3 class="font-semibold">Background</h3>

        <p class="text-secondary">
          The background is the most used color, secondary is used on borders and tertiary is used
          on disabled components and sliders.
        </p>

        <div class="gap-4 grid grid-cols-3">
          <ColorInput
            value={$settings.theme.background}
            name="Background"
            oninput={(value) => {
              onSetBackgroundColor(value);
            }}
          />

          <ColorInput
            value={$settings.theme.secondary_background}
            name="Secondary"
            oninput={(value) => {
              onSetSecondaryBackgroundColor(value);
            }}
          />

          <ColorInput
            value={$settings.theme.tertiary_background}
            name="Tertiary"
            oninput={(value) => {
              onSetTertiaryBackgroundColor(value);
            }}
          />
        </div>
      </div>

      <div>
        <h3 class="font-semibold">Accent</h3>

        <div class="gap-4 grid grid-cols-3">
          <ColorInput
            value={$settings.theme.accent}
            name="Accent"
            oninput={(value) => {
              onSetAccentColor(value);
            }}
          />

          <ColorInput
            value={$settings.theme.on_accent}
            name="On Accent"
            oninput={(value) => {
              onSetOnAccentColor(value);
            }}
          />

          <ColorInput
            value={$settings.theme.danger}
            name="Danger"
            oninput={(value) => {
              onSetDangerColor(value);
            }}
          />

          <ColorInput
            value={$settings.theme.on_danger}
            name="On Danger"
            oninput={(value) => {
              onSetOnDangerColor(value);
            }}
          />
        </div>
      </div>

      <div>
        <h3 class="font-semibold">Text</h3>

        <p class="text-secondary">
          The text colors is used for titles/headers. The secondary is used below the
          titles/headers. The tertiary color is used on placeholders. The disabled color is used on
          disabled buttons.
        </p>

        <div class="gap-4 grid grid-cols-3">
          <ColorInput
            value={$settings.theme.text}
            name="Text"
            oninput={(value) => {
              onSetTextColor(value);
            }}
          />

          <ColorInput
            value={$settings.theme.secondary_text}
            name="Secondary"
            oninput={(value) => {
              onSetSecondaryTextColor(value);
            }}
          />

          <ColorInput
            value={$settings.theme.tertiary_text}
            name="Tertiary"
            oninput={(value) => {
              onSetTertiaryTextColor(value);
            }}
          />

          <ColorInput
            value={$settings.theme.disabled_text}
            name="Disabled"
            oninput={(value) => {
              onSetDisabledTextColor(value);
            }}
          />
        </div>
      </div>
    </div>
  </div>
</div>
