#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod models;
mod schema;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
// TODO: Check if Database exists first
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
                crate::database::create_collection,
                crate::database::get_all_collections,
                crate::database::get_collections_titles,
                crate::database::insert_question_by_collection_id,
                crate::database::get_questions_by_collection_id,
                crate::database::get_collection_by_id,
                crate::database::create_parent_collection,
                crate::database::get_parent_collection_by_id,
                crate::database::get_all_parent_collections,
        ])
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
