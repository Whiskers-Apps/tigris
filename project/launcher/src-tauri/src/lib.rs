use std::{
    fs,
    os::unix::net::UnixListener,
    thread::{self},
};

use features::{
    actions::{invoke_open_link, invoke_run_action},
    dirs::setup_dirs,
    form::{invoke_complete_form, invoke_get_form},
    indexing::setup_indexing,
    search::invoke_get_search_results,
    settings::{
        invoke_export_theme, invoke_get_blacklisted_apps, invoke_get_extensions,
        invoke_get_extensions_store, invoke_get_settings, invoke_get_themes_store,
        invoke_get_whitelisted_apps, invoke_import_theme, invoke_install_extension,
        invoke_open_extensions_dir, invoke_reload_extensions, invoke_uninstall_extension,
        invoke_update_extension, invoke_write_extensions_store, invoke_write_settings,
        invoke_write_themes_store,
    },
    tray::setup_tray,
    window::refresh_window,
};
use serde::Serialize;
use tauri::{Emitter, Manager, PhysicalSize, WebviewUrl, WebviewWindowBuilder};

pub mod features;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_fs::init())
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
            invoke_open_extensions_dir,
            invoke_get_extensions_store,
            invoke_write_extensions_store,
            invoke_get_themes_store,
            invoke_write_themes_store,
            invoke_reload_extensions,
            invoke_update_extension,
            invoke_uninstall_extension,
            invoke_install_extension,
            refresh_window
        ])
        .setup(|app| {
            let window = app.handle().get_webview_window("main").unwrap();
            let _ = window.close();

            setup_tray(&app);
            setup_dirs();
            setup_indexing();

            let app_clone = app.handle().to_owned();

            thread::spawn(move || {
                let _ = fs::remove_file("/tmp/tigris-show");

                let listener =
                    UnixListener::bind("/tmp/tigris-show").expect("Error listening to show");

                for stream in listener.incoming() {
                    if let Ok(_) = stream {
                        let main_window = &app_clone.get_webview_window("main");

                        let window = if let Some(main_window) = main_window {
                            main_window.clone()
                        } else {
                            WebviewWindowBuilder::new(
                                &app_clone,
                                "main",
                                WebviewUrl::App("/".into()),
                            )
                            .transparent(true)
                            .shadow(false)
                            .decorations(false)
                            .auto_resize()
                            .resizable(false)
                            .build()
                            .unwrap()
                        };

                        if !main_window.is_some() {
                            let _ = window.set_size(PhysicalSize::new(900.0, 900.0));
                        }

                        let _ = window.show();

                        #[derive(Serialize, Clone)]
                        struct Payload {}

                        app_clone.emit("show", Payload {}).unwrap();
                    }
                }
            });

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_, event| {
            match event {
                tauri::RunEvent::ExitRequested { api, .. } => {
                    api.prevent_exit();
                }
                _ => {}
            };
        });
}
