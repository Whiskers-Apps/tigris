import {
  getSettings,
  setAccentBorder,
  setBoxBorderRadius,
  setBoxBorderWidth,
  setIconBorderRadius,
  setResultBorderRadius,
  setTheme,
} from "$lib/repositories/SettingsRepository";
import { path } from "@tauri-apps/api";
import { invoke } from "@tauri-apps/api/core";
import { downloadDir } from "@tauri-apps/api/path";
import { save, open } from "@tauri-apps/plugin-dialog";
import { load as loadSettings } from "$lib/repositories/SettingsRepository";
import { refreshCSS } from "$lib/components/layouts/MainLayoutVM";
import { Routes } from "$lib/features/Routes";
import { onGoToPage, StyleSettingsPage } from "../StylePageVM";

export function onSetBoxBorderRadius(value: number) {
  setBoxBorderRadius(value);
}

export function onSetBoxBorderWidth(value: number) {
  setBoxBorderWidth(value);
}

export function onSetAccentBorder(value: boolean) {
  setAccentBorder(value);
}

export function onSetResultBorderRadius(value: number) {
  setResultBorderRadius(value);
}

export function onSetIconBorderRadius(value: number) {
  setIconBorderRadius(value);
}

export function onSetBackgroundColor(value: string) {
  let newTheme = getSettings().theme;
  newTheme.background = value;

  setTheme(newTheme);
}

export function onSetSecondaryBackgroundColor(value: string) {
  let newTheme = getSettings().theme;
  newTheme.secondary_background = value;

  setTheme(newTheme);
}

export function onSetTertiaryBackgroundColor(value: string) {
  let newTheme = getSettings().theme;
  newTheme.tertiary_background = value;

  setTheme(newTheme);
}

export function onSetAccentColor(value: string) {
  let newTheme = getSettings().theme;
  newTheme.accent = value;

  setTheme(newTheme);
}

export function onSetOnAccentColor(value: string) {
  let newTheme = getSettings().theme;
  newTheme.on_accent = value;

  setTheme(newTheme);
}

export function onSetDangerColor(value: string) {
  let newTheme = getSettings().theme;
  newTheme.danger = value;

  setTheme(newTheme);
}

export function onSetOnDangerColor(value: string) {
  let newTheme = getSettings().theme;
  newTheme.on_danger = value;

  setTheme(newTheme);
}

export function onSetTextColor(value: string) {
  let newTheme = getSettings().theme;
  newTheme.text = value;

  setTheme(newTheme);
}

export function onSetSecondaryTextColor(value: string) {
  let newTheme = getSettings().theme;
  newTheme.secondary_text = value;

  setTheme(newTheme);
}

export function onSetTertiaryTextColor(value: string) {
  let newTheme = getSettings().theme;
  newTheme.tertiary_text = value;

  setTheme(newTheme);
}

export function onSetDisabledTextColor(value: string) {
  let newTheme = getSettings().theme;
  newTheme.disabled_text = value;

  setTheme(newTheme);
}

export async function onExportTheme() {
  const path = await save({
    filters: [
      {
        name: "Json",
        extensions: ["json"],
      },
    ],
    defaultPath: `${await downloadDir()}/theme.json`,
  });

  if (path !== null) {
    invoke("invoke_export_theme", { path: path });
  }
}

export async function onImportTheme() {
  const paths = await open({
    multiple: false,
    directory: false,
    filters: [
      {
        name: "Json",
        extensions: ["json"],
      },
    ],
  });

  if (paths !== null) {
    let path = paths.toString();

    await invoke("invoke_import_theme", { path: path });

    await loadSettings();

    refreshCSS();
  }
}

export function onOpenStore() {
  onGoToPage(StyleSettingsPage.STORE);
}
