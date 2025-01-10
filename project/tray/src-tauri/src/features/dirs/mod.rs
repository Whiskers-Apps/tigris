use std::fs::create_dir_all;

use tigris_rs::features::paths::{get_cache_dir, get_config_dir, get_extensions_dir, get_local_dir, get_tmp_dir};

pub fn setup_dirs() {
    let local_dir = get_local_dir();
    let cache_dir = get_cache_dir();
    let tmp_dir = get_tmp_dir();
    let extensions_dir = get_extensions_dir();
    let config_dir = get_config_dir();

    if !local_dir.exists() {
        create_dir_all(&local_dir).expect("Error creating local directory");
    }

    if !cache_dir.exists() {
        create_dir_all(&cache_dir).expect("Error creating cache directory");
    }

    if !tmp_dir.exists() {
        create_dir_all(&tmp_dir).expect("Error creating tmp directory");
    }

    if !extensions_dir.exists() {
        create_dir_all(&extensions_dir).expect("Error creating extensions directory");
    }

    if !config_dir.exists() {
        create_dir_all(&config_dir).expect("Error creating config directory");
    }
}
