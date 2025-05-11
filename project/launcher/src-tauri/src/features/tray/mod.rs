use std::{os::unix::net::UnixStream, process::exit, thread};

use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    App,
};
use tigris_rs::features::indexing::{index_apps, index_extensions};

pub fn setup_tray(app: &App) {
    let show_menu_item = MenuItem::with_id(app, "show", "Show", true, None::<&str>).unwrap();
    let refresh_menu_item =
        MenuItem::with_id(app, "refresh", "Refresh", true, None::<&str>).unwrap();
    let quit_menu_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>).unwrap();

    let menu =
        Menu::with_items(app, &[&show_menu_item, &refresh_menu_item, &quit_menu_item]).unwrap();

    TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .show_menu_on_left_click(true)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "show" => {
                UnixStream::connect("/tmp/tigris-show").expect("Error sending stream");
            }
            "refresh" => {
                thread::spawn(move || {
                    index_apps();
                    index_extensions();
                });
            }
            "quit" => {
                app.cleanup_before_exit();
                exit(0);
            }
            _ => {}
        })
        .build(app)
        .unwrap();
}
