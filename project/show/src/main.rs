use std::{os::unix::net::UnixStream, path::PathBuf};

fn main() {
    if PathBuf::from("/tmp/tigris-show").exists() {
        UnixStream::connect("/tmp/tigris-show").expect("Error sending stream");
    }
}
        