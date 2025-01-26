use std::{fs, path::PathBuf};

use git2::Repository;
use serde::{Deserialize, Serialize};
use tigris_rs::features::{
    apps::{get_apps, App},
    extensions::{get_extension_dir, get_extensions, Extension},
    indexing::index_extensions,
    paths::{get_extensions_dir, get_extensions_store_path, get_themes_store_path},
    settings::{get_settings, write_settings, Settings, Theme},
};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StoreExtension {
    pub id: String,
    pub name: String,
    pub description: String,
    pub repository: String,
    pub author: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StoreTheme {
    pub id: String,
    pub name: String,
    pub repository: String,
    pub author: String,
    pub files: Vec<ThemeFile>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ThemeFile {
    pub name: String,
    pub link: String,
}

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

#[tauri::command()]
pub fn invoke_open_extensions_dir() {
    open::that(&get_extensions_dir()).expect("Error opening extensions dir");
}

#[tauri::command()]
pub fn invoke_get_extension_store() -> Vec<StoreExtension> {
    let store_path = get_extensions_store_path();

    if !store_path.exists() {
        return vec![];
    }

    let bytes = fs::read(&store_path).expect("Error reading extensions store");

    let store = bincode::deserialize::<Vec<StoreExtension>>(&bytes)
        .expect("Error deserializing extensions store");

    store
}

#[tauri::command()]
pub fn invoke_write_extensions_store(store: Vec<StoreExtension>) {
    let bytes = bincode::serialize(&store).expect("Error serializing extensions store");
    fs::write(get_extensions_store_path(), &bytes).expect("Error writing extensions store");
}

#[tauri::command()]
pub fn invoke_get_themes_store() -> Vec<StoreTheme> {
    let store_path = get_themes_store_path();

    if !store_path.exists() {
        return vec![];
    }

    let bytes = fs::read(&store_path).expect("Error reading themes store");

    let store =
        bincode::deserialize::<Vec<StoreTheme>>(&bytes).expect("Error deserializing themes store");

    store
}

#[tauri::command()]
pub fn invoke_write_themes_store(store: Vec<StoreTheme>) {
    let bytes = bincode::serialize(&store).expect("Error serializing themes store");
    fs::write(get_themes_store_path(), &bytes).expect("Error writing themes store");
}

#[tauri::command()]
pub fn invoke_reload_extensions() {
    index_extensions();
}

#[tauri::command(rename_all = "snake_case")]
pub async fn invoke_update_extension(extension_id: String) -> Result<(), String> {
    let dir = get_extension_dir(&extension_id).expect("Error getting extension dir");
    let repo = Repository::discover(&dir).expect("Error getting repository");

    if let Ok(head) = repo.head() {
        let branch = head
            .shorthand()
            .expect("Error getting head branch shorthand")
            .to_string();

        if let Ok(remote) = repo.find_remote("origin") {
            remote
                .clone()
                .fetch(&[&branch], None, None)
                .expect("Error fetching repository");

            let oid = repo
                .refname_to_id(&format!("refs/remotes/origin/{branch}"))
                .expect("Error getting oid");

            let object = repo.find_object(oid, None).unwrap();

            repo.reset(&object, git2::ResetType::Hard, None)
                .expect("Error resetting repository");

            return Ok(());
        }

        return Err(String::from("Error getting code from origin"));
    }

    Err(String::from("Extension doesn't have a repository"))
}

#[tauri::command(rename_all = "snake_case")]
pub async fn invoke_uninstall_extension(extension_id: String) {
    let dir = get_extension_dir(&extension_id).expect("Error getting extension dir");
    fs::remove_dir_all(dir).expect("Error removing extension dir");

    let mut settings = get_settings();
    settings.extension_values = settings
        .extension_values
        .iter()
        .filter(|ev| ev.extension_id != extension_id)
        .map(|ev| ev.clone())
        .collect();

    write_settings(&settings);
}
