use std::{path::PathBuf, process::Command};

use sniffer_rs::sniffer::Sniffer;
use tigris_core::features::{
    actions::{OpenAppAction, OpenLinkAction, ResultAction},
    api::{get_extension_results, write_extension_request, ExtensionRequest},
    extensions::get_extension_dir,
    paths::get_icons_dir,
    search::get_search_query,
    search_results::SearchResult,
    settings::{get_settings, SearchEngine, Settings},
};

use super::{
    app::App,
    indexing::{get_apps, get_recent_apps},
};

#[tauri::command(rename_all = "snake_case")]
pub fn invoke_get_search_results(search_text: String) -> Result<Vec<SearchResult>, String> {
    let mut results = Vec::<SearchResult>::new();
    let settings = get_settings();
    let blacklisted_apps: Vec<PathBuf> = settings
        .blacklist
        .clone()
        .iter()
        .map(|path| PathBuf::from(path))
        .collect();

    if search_text.trim().is_empty() {
        return if settings.show_recent_apps {
            let recent_apps: Vec<SearchResult> = get_recent_apps()
                .map_err(|e| e.to_string())?
                .iter()
                .filter(|app| !blacklisted_apps.contains(&app.path))
                .map(|app| get_app_result(app, &settings))
                .collect();

            Ok(recent_apps)
        } else {
            Ok(vec![])
        };
    }

    let search_query = get_search_query(&search_text);
    let sniffer = Sniffer::new();

    if let Some(keyword) = search_query.keyword {
        // From Extensions
        let extensions_values = &settings.extension_values;

        let extension_value = extensions_values
            .iter()
            .find(|value| value.setting_id == "keyword" && value.value == keyword);

        if let Some(extension_value) = extension_value {
            write_extension_request(&ExtensionRequest::new_get_results_request(
                &search_query.search_text,
            ));

            let result = Command::new("sh")
                .arg("-c")
                .arg("./extension")
                .current_dir(get_extension_dir(&extension_value.extension_id).unwrap())
                .output()
                .expect("Error running extension");

            if result.status.success() {
                return Ok(get_extension_results());
            }
        }

        // From Search Engines
        let search_engines = &settings.search_engines;
        let search_engine = search_engines
            .iter()
            .find(|engine| &engine.keyword == &keyword);

        if let Some(search_engine) = search_engine {
            results.push(get_search_engine_result(
                search_engine,
                &search_query.search_text,
            ));

            return Ok(results);
        }
    }

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
        .unwrap_or(vec![])
        .into_iter()
        .filter(|app| {
            sniffer.matches(&app.name, &search_text) && !blacklisted_apps.contains(&app.path)
        })
        .map(|app| get_app_result(&app, &settings))
        .collect();

    results.extend(apps);

    if results.is_empty() {
        let search_engines = &settings.search_engines;
        let search_engine = search_engines
            .iter()
            .find(|engine| &engine.id == &settings.default_search_engine);

        if let Some(search_engine) = search_engine {
            results.push(get_search_engine_result(search_engine, &search_text));
        }
    }

    Ok(results)
}

fn get_app_result(app: &App, settings: &Settings) -> SearchResult {
    let mut result = SearchResult::new(&app.name).set_action(&ResultAction::new_open_app_action(
        &OpenAppAction::new(&PathBuf::from(&app.path)),
    ));

    if let Some(icon_path) = &app.icon_path {
        if !settings.hide_app_icons {
            result = result.set_icon_path(&PathBuf::from(icon_path));
        }
    } else {
        if !settings.hide_app_icons {
            let file_icon_path = get_icons_dir().join("file.svg");

            result = result
                .set_icon_color("accent")
                .set_icon_path(&file_icon_path);
        }
    }

    result
}

fn get_search_engine_result(search_engine: &SearchEngine, search_text: &str) -> SearchResult {
    SearchResult::new(&search_engine.name)
        .set_description(&format!("Search for {}", &search_text))
        .set_icon_path(&get_icons_dir().join("web.svg"))
        .set_icon_color("accent")
        .set_action(&ResultAction::new_open_link_action(&OpenLinkAction::new(
            &format!("{}", &search_engine.query).replace("%s", &search_text),
        )))
}
