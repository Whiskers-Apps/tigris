use std::path::PathBuf;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct App {
    pub path: PathBuf,
    pub icon_path: Option<PathBuf>,
    pub name: String,
}
