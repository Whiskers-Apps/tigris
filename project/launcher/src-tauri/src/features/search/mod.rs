use std::path::PathBuf;

use sniffer_rs::sniffer::Sniffer;
use tigris_rs::features::{
    actions::{OpenAppAction, ResultAction},
    apps::{get_apps, get_recent_apps, App},
    paths::get_icons_dir,
    search_results::SearchResult,
};

#[tauri::command(rename_all = "snake_case")]
pub fn invoke_get_search_results(search_text: String) -> Vec<SearchResult> {
    let mut results = Vec::<SearchResult>::new();

    if search_text.trim().is_empty() {
        return get_recent_apps()
            .iter()
            .map(|app| get_app_result(app))
            .collect();
    }

    let sniffer = Sniffer::new();

    if sniffer.matches("settings", &search_text) {
        results.push(
            SearchResult::new("Settings")
                .set_action(&ResultAction::new_open_settings_action())
                .set_icon_color("accent")
                .set_icon_path(&get_icons_dir().join("settings.svg"))
                .set_description("Open the launcher settings page"),
        );
    }

    //let mut results: Vec<SearchResult> = vec![];
    let sniffer = Sniffer::new();

    let apps: Vec<SearchResult> = get_apps()
        .iter()
        .map(|app| app.to_owned())
        .filter(|app| sniffer.matches(&app.name, &search_text))
        .map(|app| get_app_result(&app))
        .collect();

    results.extend(apps);
    results
}

fn get_app_result(app: &App) -> SearchResult {
    let mut result = SearchResult::new(&app.name).set_action(&ResultAction::new_open_app_action(
        &OpenAppAction::new(&PathBuf::from(&app.path)),
    ));

    if let Some(icon_path) = &app.icon_path {
        result = result.set_icon_path(&PathBuf::from(icon_path));
    } else {
        let file_icon_path = get_icons_dir().join("file.svg");

        result = result
            .set_icon_color("accent")
            .set_icon_path(&file_icon_path);
    }

    result
}
