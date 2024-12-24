use features::{dirs::setup_dirs, indexing::setup_indexing, tray::setup_tray};
use tauri::Manager;

pub mod features;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {}))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![])
        .setup(|app| {
            app.get_webview_window("main").unwrap().close().unwrap();

            setup_tray(&app);
            setup_dirs();
            setup_indexing();

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app, event| match event {
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            tauri::RunEvent::Ready => {}
            _ => {}
        });
}
