use std::{path::PathBuf, process::Command, thread};

use tauri::Window;
use tigris_rs::features::{
    actions::{ActionType, ResultAction},
    apps::{get_apps, get_recent_apps, write_recent_apps, App},
};

#[tauri::command()]
pub fn invoke_run_action(action: ResultAction, window: Window) {
    match action.action_type {
        ActionType::CopyText => {}
        ActionType::CopyImage => {}
        ActionType::OpenApp => open_app(action.open_app_action.unwrap().path, &window),
        ActionType::OpenForm => {}
        ActionType::OpenLink => {}
        ActionType::RunExtension => {}
        _ => {}
    };
}

fn open_app(path: String, window: &Window) {
    thread::spawn(move || {
        let desktop_file_dir = PathBuf::from(&path)
            .parent()
            .expect("Error reading parent directory")
            .to_owned();

        let desktop_file_name = PathBuf::from(&path)
            .file_name()
            .expect("Error getting app file name")
            .to_owned();

        Command::new("gtk-launch")
            .arg(desktop_file_name)
            .current_dir(desktop_file_dir)
            .spawn()
            .expect("Error opening app");

        let app = get_apps()
            .iter()
            .map(|app| app.to_owned())
            .find(|app| &app.path == &path)
            .unwrap();

        let mut new_recent_apps: Vec<App> = get_recent_apps()
            .iter()
            .map(|app| app.to_owned())
            .filter(|app| &app.path != &path)
            .collect();

        new_recent_apps.insert(0, app);

        let cut_size = if new_recent_apps.len() < 16 {
            new_recent_apps.len()
        } else {
            16
        };

        write_recent_apps(new_recent_apps[0..cut_size].to_owned());
    });

    window.close().unwrap();
}
