use std::{error::Error, fs, path::PathBuf, sync::mpsc::channel, thread};

use freedesktop_desktop_entry::{default_paths, DesktopEntry, Iter};
use notify::{event, Watcher};
use postcard::{from_bytes, to_allocvec};
use tigris_core::features::paths::get_extensions_dir;
use tux_icons::icon_fetcher::IconFetcher;

use super::{app::App, paths::get_local_dir};

fn get_indexing_dir() -> Result<PathBuf, Box<dyn Error>> {
    let path = get_local_dir()?.join("indexing");

    if !path.exists() {
        fs::create_dir_all(&path)?;
    }

    Ok(path)
}

fn get_recent_apps_path() -> Result<PathBuf, Box<dyn Error>> {
    let path = get_indexing_dir()?.join("recent-apps.bin");
    Ok(path)
}

fn get_apps_path() -> Result<PathBuf, Box<dyn Error>> {
    let path = get_indexing_dir()?.join("apps.bin");
    Ok(path)
}

// Indexes apps and extensions and then watches changes on those folders.
pub fn setup_indexing() {
    thread::spawn(move || {
        let _ = index_apps();
        index_extensions();

        let mut paths = default_paths().map(|path| path).collect::<Vec<PathBuf>>();
        let extensions_dir = get_extensions_dir();

        paths.push(extensions_dir);

        let (tx, rx) = channel();

        let mut watcher = match notify::recommended_watcher(tx) {
            Ok(watcher) => watcher,
            Err(e) => {
                eprintln!("Error using watcher: {e}");
                return;
            }
        };

        for path in paths {
            if !path.exists() {
                continue;
            }

            let _ = watcher.watch(&path, notify::RecursiveMode::Recursive);
        }

        for res in rx {
            if let Ok(event) = res {
                match event.kind {
                    event::EventKind::Create(_) => {
                        for path in event.paths {
                            auto_index(path);
                        }
                    }
                    event::EventKind::Modify(_) => {
                        for path in event.paths {
                            auto_index(path);
                        }
                    }
                    event::EventKind::Remove(_) => {
                        for path in event.paths {
                            auto_index(path);
                        }
                    }
                    _ => {}
                }
            }
        }
    });
}

fn auto_index(path: PathBuf) {
    let extensions_dir = get_extensions_dir();
    let extensions_dir_display = extensions_dir.display().to_string();

    if path
        .display()
        .to_string()
        .starts_with(&extensions_dir_display)
    {
        index_extensions();
    } else {
        let _ = index_apps().map_err(|e| {
            eprintln!("Error indexing apps: {e}");
        });
    }
}

pub fn index_extensions() {}

pub fn index_apps() -> Result<(), Box<dyn Error>> {
    let icon_fetcher = IconFetcher::new().set_return_target_path(true);

    let mut apps: Vec<App> = Iter::new(default_paths())
        .filter_map(|path| {
            if !path.exists() {
                return None;
            }

            let entry = DesktopEntry::from_path(&path, None::<&[&str]>).ok()?;
            let entry_type = entry.type_()?;

            if entry.no_display() || entry_type != "Application" {
                return None;
            }

            let name = entry.name::<&str>(&[])?.to_string();
            let icon = icon_fetcher.get_icon_path_from_desktop(&path);

            let icon_path = if let Some(icon) = icon {
                if !icon.ends_with(".svgz") {
                    Some(icon)
                } else {
                    None
                }
            } else {
                None
            };

            let app = App {
                path,
                icon_path,
                name,
            };

            Some(app)
        })
        .collect();

    apps.sort_by_key(|app| app.name.to_lowercase());

    let recent_apps: Vec<App> = get_recent_apps()
        .unwrap_or(vec![])
        .into_iter()
        .filter(|app| apps.contains(&app))
        .collect();

    write_apps(apps)?;
    write_recent_apps(recent_apps)?;

    Ok(())
}

pub fn get_apps() -> Result<Vec<App>, Box<dyn Error>> {
    let bytes = fs::read(get_apps_path()?)?;
    let apps: Vec<App> = from_bytes(&bytes)?;
    Ok(apps)
}

fn write_apps(apps: Vec<App>) -> Result<(), Box<dyn Error>> {
    let bytes: Vec<u8> = to_allocvec(&apps)?;
    fs::write(get_apps_path()?, &bytes)?;
    Ok(())
}

pub fn get_recent_apps() -> Result<Vec<App>, Box<dyn Error>> {
    let bytes = fs::read(get_recent_apps_path()?)?;
    let apps: Vec<App> = from_bytes(&bytes)?;
    Ok(apps)
}

pub fn write_recent_apps(apps: Vec<App>) -> Result<(), Box<dyn Error>> {
    let bytes: Vec<u8> = to_allocvec(&apps)?;
    fs::write(get_recent_apps_path()?, &bytes)?;
    Ok(())
}
