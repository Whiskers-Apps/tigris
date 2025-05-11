use tauri::Window;

#[tauri::command]
pub async fn refresh_window(window: Window) {
    let mut size = window.outer_size().unwrap();

    size.height = if size.height == 900 { 901 } else { 900 };

    let _ = window.set_size(size);
}
