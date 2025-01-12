use std::{
    process::{exit, Command},
    thread,
};

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
        .menu_on_left_click(true)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "show" => {
                thread::spawn(move || {
                    Command::new("sh")
                        .arg("-c")
                        .arg("WEBKIT_DISABLE_COMPOSITING_MODE=1 GDK_BACKEND=x11 tigris-launcher")
                        .output()
                        .expect("Error opening launcher");
                });
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
