use std::{
    thread::{self, sleep},
    time::Duration,
};

use tigris_rs::features::indexing::{index_apps, index_extensions};

pub fn setup_indexing() {
    thread::spawn(move || loop {
        index_apps();
        index_extensions();
        
        sleep(Duration::from_secs(180));
    });
}
