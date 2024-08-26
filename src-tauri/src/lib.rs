#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod database;
mod models;
mod schema;
mod api;

use window_vibrancy::{apply_acrylic, apply_mica, apply_tabbed};
use tauri::Manager;

use crate::api::question_collection;
use crate::api::parent_collection;
use crate::api::question;
use crate::api::reason;
use crate::api::question_reason;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
// TODO: Check if Database exists first
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
                crate::question_collection::create_collection,
                crate::parent_collection::create_parent_collection,
                crate::parent_collection::insert_nested_parent_collection,
                crate::parent_collection::get_parent_collection_by_id,
                crate::parent_collection::get_all_parent_collections,
                crate::parent_collection::get_all_unnested_parents,
                crate::question_collection::get_all_collections,
                crate::question_collection::get_collections_titles,
                crate::question_collection::get_collection_by_id,
                crate::question::insert_question_by_collection_id,
                crate::question::get_questions_by_collection_id,
                crate::question::get_question_by_question_number,
                crate::reason::insert_reason,
                crate::reason::get_reasons,
                crate::reason::get_reason_by_id,
                crate::question_reason::insert_question_reason,
                crate::question_reason::get_question_reasons_by_id,
        ])
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            // let _ = apply_mica(&window, Some(true));
            // let _ = apply_tabbed(&window, Some(true));
            let _ = apply_acrylic(&window, Some((0,0,0,10)));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
