use std::{fs, path::PathBuf};

use tigris_rs::features::{
    apps::{get_apps, App},
    extensions::{get_extensions, Extension},
    settings::{get_settings, write_settings, Settings, Theme},
};

#[tauri::command()]
pub fn invoke_get_settings() -> Settings {
    get_settings()
}

#[tauri::command()]
pub fn invoke_write_settings(settings: Settings) {
    write_settings(&settings);
}

#[tauri::command()]
pub fn invoke_get_extensions() -> Vec<Extension> {
    get_extensions()
}

#[tauri::command()]
pub fn invoke_get_blacklisted_apps() -> Vec<App> {
    let blacklist = get_settings().blacklist;
    let apps = get_apps();

    let blacklisted_apps: Vec<App> = apps
        .iter()
        .filter(|app| blacklist.contains(&app.path))
        .map(|app| app.to_owned())
        .collect();

    blacklisted_apps
}

#[tauri::command()]
pub fn invoke_get_whitelisted_apps() -> Vec<App> {
    let blacklisted_apps = get_settings().blacklist;
    let apps = get_apps();

    let whitelisted_apps: Vec<App> = apps
        .iter()
        .filter(|app| !blacklisted_apps.contains(&app.path))
        .map(|app| app.to_owned())
        .collect();

    whitelisted_apps
}

#[tauri::command()]
pub fn invoke_export_theme(path: PathBuf) {
    let theme = get_settings().theme;
    let theme_json = serde_json::to_string_pretty(&theme).expect("Error parsing theme");

    fs::write(path, &theme_json).expect("Error writing theme");
}

#[tauri::command()]
pub fn invoke_import_theme(path: PathBuf) {
    let file_content = fs::read_to_string(path).expect("Error reading file");

    if let Ok(theme) = serde_json::from_str::<Theme>(&file_content) {
        let mut settings = get_settings();
        settings.theme = theme;

        write_settings(&settings);
    }
}
