use std::{error::Error, fs, path::PathBuf};

pub fn get_local_dir() -> Result<PathBuf, Box<dyn Error>> {
    let path = dirs::data_local_dir()
        .ok_or_else(|| "Error getting home_dir".to_string())?
        .join("org-whiskersapps-tigris");

    if !path.exists() {
        fs::create_dir_all(&path)?;
    }

    Ok(path)
}
