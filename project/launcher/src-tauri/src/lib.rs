use features::{actions::invoke_run_action, search::invoke_get_search_results};

pub mod features;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            invoke_get_search_results,
            invoke_run_action
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
