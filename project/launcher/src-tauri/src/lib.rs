use features::{actions::{invoke_open_link, invoke_run_action}, search::invoke_get_search_results, settings::{invoke_get_settings, invoke_write_settings}};

pub mod features;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            invoke_get_search_results,
            invoke_run_action,
            invoke_get_settings,
            invoke_write_settings,
            invoke_open_link
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
