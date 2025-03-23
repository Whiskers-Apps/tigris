use std::{path::PathBuf, process::Command, thread};

use tauri::Window;
use tigris_rs::features::{
    actions::{ActionType, CopyImageAction, CopyTextAction, ResultAction, RunExtensionAction},
    api::{write_extension_request, write_form, ExtensionRequest},
    apps::{get_apps, get_recent_apps, write_recent_apps, App},
    extensions::get_extension_dir,
    paths::get_tmp_dir,
};

#[tauri::command()]
pub fn invoke_run_action(action: ResultAction, window: Window) {
    match action.action_type {
        ActionType::CopyText => copy_text(action.copy_text_action.unwrap(), &window),
        ActionType::CopyImage => copy_image(action.copy_image_action.unwrap(), &window),
        ActionType::OpenApp => open_app(action.open_app_action.unwrap().path, &window),
        ActionType::OpenLink => open_link(action.open_link_action.unwrap().link, &window),
        ActionType::RunExtension => run_extension(action.run_extension_action.unwrap(), &window),
        ActionType::OpenForm => write_form(&action.open_form_action.unwrap()),
        _ => {}
    };
}

fn copy_text(action: CopyTextAction, window: &Window) {
    thread::spawn(move || {
        Command::new("sh")
            .arg("-c")
            .arg(format!("wl-copy '{}'", &action.text))
            .spawn()
            .expect("Error writing to clipboard");
    });

    window.hide().unwrap();
}

fn copy_image(action: CopyImageAction, window: &Window) {
    thread::spawn(move || {
        Command::new("sh")
            .arg("-c")
            .arg(format!(
                "magick '{}' tmp.png; wl-copy -t image/png < tmp.png",
                &action.image_path
            ))
            .current_dir(get_tmp_dir())
            .spawn()
            .expect("Error copying image");
    });

    window.hide().unwrap();
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

    window.hide().unwrap();
}

fn open_link(link: String, window: &Window) {
    thread::spawn(move || {
        open::that(link).expect("Error opening link");
    });

    window.hide().unwrap();
}

fn run_extension(action: RunExtensionAction, window: &Window) {
    let request =
        ExtensionRequest::new_run_extension_action_request(&action.extension_action, &action.args);

    write_extension_request(&request);

    thread::spawn(move || {
        Command::new("sh")
            .arg("-c")
            .arg("./extension")
            .current_dir(get_extension_dir(&action.extension_id).unwrap())
            .output()
            .expect("Error running extension");
    });

    window.hide().unwrap();
}

#[tauri::command()]
pub fn invoke_open_link(link: String) {
    thread::spawn(move || {
        open::that(link).expect("Error opening link");
    });
}
