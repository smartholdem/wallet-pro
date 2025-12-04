use tauri::{Manager, Window}; // Добавляем импорты

// Команда для минимизации окна
#[tauri::command]
fn minimize_window(window: Window) {
    window.minimize().unwrap();
}

// Команда для максимизации/восстановления окна
#[tauri::command]
fn maximize_window(window: Window) {
    // Проверяем, развернуто ли окно. Если да, восстанавливаем. Иначе - разворачиваем.
    if window.is_maximized().unwrap() {
        window.unmaximize().unwrap();
    } else {
        window.maximize().unwrap();
    }
}

// Команда для закрытия окна
#[tauri::command]
fn close_window(window: Window) {
    window.close().unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            minimize_window,
            maximize_window,
            close_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
