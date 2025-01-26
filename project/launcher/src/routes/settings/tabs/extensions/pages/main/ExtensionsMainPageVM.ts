import type { Extension } from "$lib/features/Extensions";
import { type ExtensionValue } from "$lib/features/Settings";
import { invoke } from "@tauri-apps/api/core";
import { get, writable } from "svelte/store";
import type { SelectValue } from "$lib/components/form/helper-classes/SelectValue";
import { getSettings, writeSettings } from "$lib/repositories/SettingsRepository";
import { onGoToPage, Page } from "../../ExtensionsPageVM";

export const state = writable({
  loading: true,
  extensions: [] as Extension[],
  values: [] as ExtensionValue[],
  updating: false,
  showDeleteExtensionDialog: false,
  extensionToDelete: null as string | null,
});

export async function load() {
  let newState = get(state);

  newState.loading = false;
  newState.extensions = await invoke("invoke_get_extensions");
  newState.values = getSettings().extension_values;

  state.set(newState);
}

export function getSettingValue(extensionId: string, settingId: string): string {
  for (const extensionValue of get(state).values) {
    if (extensionValue.extension_id === extensionId && extensionValue.setting_id === settingId) {
      return extensionValue.value;
    }
  }

  return "Something went wrong !!!";
}

export async function onSetSettingValue(extensionId: string, settingId: string, value: string) {
  let newState = get(state);
  let newSettings = getSettings();
  let newExtensionValues: ExtensionValue[] = [];

  for (const extensionValue of newSettings.extension_values) {
    if (extensionValue.extension_id === extensionId && extensionValue.setting_id === settingId) {
      let newExtensionValue = extensionValue;
      newExtensionValue.value = value;

      newExtensionValues.push(newExtensionValue);
    } else {
      newExtensionValues.push(extensionValue);
    }
  }

  newState.values = newExtensionValues;
  state.set(newState);

  writeSettings(newSettings);
}

export function canShowSetting(extensionId: string, settingId: string): boolean {
  for (const extension of get(state).extensions) {
    if (extension.id === extensionId) {
      for (const setting of extension.settings) {
        if (setting.id === settingId) {
          if (setting.conditional_show === null) {
            return true;
          }

          for (const condition of setting!!.conditional_show) {
            if (condition.setting_value === getSettingValue(extensionId, condition.setting_id)) {
              return true;
            }
          }
        }
      }
    }
  }

  return false;
}

export function getSelectValue(extensionId: string, settingId: string): SelectValue {
  let settingValue = getSettingValue(extensionId, settingId);

  for (const extension of get(state).extensions) {
    if (extension.id === extensionId) {
      for (const setting of extension.settings) {
        if (setting.id === settingId) {
          for (const selectValue of setting.select_values!!) {
            if (selectValue.id === settingValue) {
              return {
                id: selectValue.id,
                text: selectValue.text,
              };
            }
          }
        }
      }
    }
  }

  return {
    id: "",
    text: "",
  };
}

export function getSelectValues(extensionId: string, settingId: string): SelectValue[] {
  let values: SelectValue[] = [];

  for (const extension of get(state).extensions) {
    if (extension.id === extensionId) {
      for (const setting of extension.settings) {
        if (setting.id === settingId) {
          for (const selectValue of setting.select_values!!) {
            values.push({
              id: selectValue.id,
              text: selectValue.text,
            });
          }

          break;
        }
      }
    }
  }

  return values;
}

export async function onOpenExtensionsDir() {
  invoke("invoke_open_extensions_dir");
}

export function onOpenStore() {
  onGoToPage(Page.STORE);
}

export async function onReloadExtensions() {
  let newState = get(state);

  newState.loading = true;

  state.set(newState);

  await invoke("invoke_reload_extensions");

  newState.extensions = await invoke("invoke_get_extensions");
  newState.values = getSettings().extension_values;
  newState.loading = false;

  state.set(newState);
}

export async function onUpdateExtension(extensionId: string) {
  let newState = get(state);

  newState.updating = true;

  state.set(newState);

  try {
    await invoke("invoke_update_extension", { extension_id: extensionId });
    await invoke("invoke_reload_extensions");

    newState.extensions = await invoke("invoke_get_extensions");
    newState.values = getSettings().extension_values;
    newState.updating = false;

    state.set(newState);
  } catch (error) {
    console.error(error);
  }

  newState.updating = false;
  state.set(newState);
}

export function onUninstallExtension(extensionId: string) {
  let newState = get(state);
  newState.showDeleteExtensionDialog = true;
  newState.extensionToDelete = extensionId;
  state.set(newState);
}

export function onCloseUninstallDialog() {
  let newState = get(state);
  newState.showDeleteExtensionDialog = false;
  newState.extensionToDelete = null;
  state.set(newState);
}

export async function onConfirmUninstallExtension() {
  let newState = get(state);
  let extensionId = newState.extensionToDelete!!;

  newState.showDeleteExtensionDialog = false;
  state.set(newState);

  await invoke("invoke_uninstall_extension", { extension_id: extensionId });

  onReloadExtensions();
}
