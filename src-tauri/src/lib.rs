#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod api;
mod database;
mod models;
mod schema;

use tauri::Manager;
use window_vibrancy::apply_acrylic;

use dotenvy::dotenv;
use std::env;

use crate::api::collection;
use crate::api::question;
use crate::api::question_collection;
use crate::api::question_tag;
use crate::api::question_type;
use crate::api::tag;
use crate::database::{ check_if_database_exists, is_dev_build };

#[cfg_attr(mobile, tauri::mobile_entry_point)]
// TODO: Check if Database exists first
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            crate::question_collection::create_questions_collection,
            crate::question_collection::get_all_questions_collections,
            crate::question_collection::get_collections_titles,
            crate::question_collection::get_questions_collection_by_id,
            crate::question_collection::update_question_collection_title_by_id,
            crate::question_collection::delete_questions_collection_by_id,
            crate::collection::create_collection,
            crate::collection::get_collection_by_id,
            crate::collection::get_all_collections,
            crate::collection::get_all_super_collections,
            crate::collection::update_collection_title_by_id,
            crate::collection::get_untitled_count,
            crate::collection::delete_collection_by_id,
            crate::question::insert_question_by_collection_id,
            crate::question::get_questions_by_collection_id,
            crate::question::get_question_by_question_number,
            crate::question::update_question_number_by_id,
            crate::question::delete_question_by_id,
            crate::question::update_question_type_by_id,
            crate::tag::insert_tag,
            crate::tag::get_tags,
            crate::tag::get_tag_by_id,
            crate::tag::update_tag_label_by_id,
            crate::tag::update_tag_color_by_id,
            crate::question_type::insert_question_type,
            crate::question_type::get_all_question_types,
            crate::question_type::update_type_color_by_id,
            crate::question_type::update_type_label_by_id,
            crate::question_tag::insert_question_tag,
            crate::question_tag::get_question_tags_by_id,
            crate::question_tag::update_question_tag_explanation_by_id,
            crate::question_tag::delete_question_tag_by_id,
            crate::database::is_dev_build,
            crate::question_tag::get_all_questions_tags,
        ])
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            let mut url = "./database.db";

            if is_dev_build() {
                url = "../database/database.db"
            }

            check_if_database_exists(url).unwrap();

            // let _ = apply_tabbed(&window, Some(true));
            apply_acrylic(&window, Some((0, 0, 0, 0))).unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
