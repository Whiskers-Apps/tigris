use tigris_rs::features::settings::{get_settings, write_settings, Settings};

#[tauri::command()]
pub fn invoke_get_settings() -> Settings {
    return get_settings();
}

#[tauri::command()]
pub fn invoke_write_settings(settings: Settings) {
    write_settings(&settings);
}
