use features::{
    actions::{invoke_open_link, invoke_run_action},
    form::{invoke_complete_form, invoke_get_form},
    search::invoke_get_search_results,
    settings::{
        invoke_export_theme, invoke_get_blacklisted_apps, invoke_get_extensions, invoke_get_settings, invoke_get_whitelisted_apps, invoke_import_theme, invoke_open_extensions_dir, invoke_write_settings
    },
};

pub mod features;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {}))
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            invoke_get_search_results,
            invoke_run_action,
            invoke_get_settings,
            invoke_write_settings,
            invoke_open_link,
            invoke_get_extensions,
            invoke_get_blacklisted_apps,
            invoke_get_whitelisted_apps,
            invoke_export_theme,
            invoke_import_theme,
            invoke_get_form,
            invoke_complete_form,
            invoke_open_extensions_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
