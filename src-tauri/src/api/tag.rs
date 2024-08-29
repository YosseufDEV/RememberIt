use diesel::prelude::*;
use crate::database::establish_connection;
use crate::models::{ Tag, NewTag };

use crate::schema::tag;

#[tauri::command]
pub fn insert_tag(label: String, color: String) -> Tag {
    let tag = NewTag {
        label,
        color,
    };

    let connection = &mut establish_connection();

    diesel::dsl::insert_into(tag::table)
                 .values(&tag)
                 .returning(Tag::as_returning())
                 .get_result(connection)
                 .expect("Failed to add tag")
}

#[tauri::command]
pub fn get_tags() -> Vec<Tag> {
    let connection = &mut establish_connection();

    tag::dsl::tag
                    .select(Tag::as_select())
                    .load(connection)
                    .expect("Failed to Get Tags")
}

#[tauri::command]
pub fn get_tag_by_id(tag_id: i32) -> Vec<Tag> {
    let connection = &mut establish_connection();

    tag::dsl::tag
                    .select(Tag::as_select())
                    .filter(tag::id.eq(tag_id))
                    .load(connection)
                    .expect("Failed to Get Tags")
}
