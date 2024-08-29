use diesel::prelude::*;
use crate::database::establish_connection;
use crate::models::{ QuestionTag, Tag };

#[tauri::command]
pub fn insert_question_tag(question_id: i32, tag_id: i32) {
    use crate::schema::question_tag;

    let connection = &mut establish_connection();
    let question_tag_obj = QuestionTag { question_id, tag_id };

    diesel::dsl::insert_into(question_tag::table)
                .values(&question_tag_obj)
                .execute(connection)
                .expect("Failed to insert Question Tag");
}

#[tauri::command]
pub fn get_question_tags_by_id(question_id: i32) -> Vec<Tag> {
    use crate::schema::question_tag;
    use crate::schema::tag;

    let connection = &mut establish_connection();

    tag::table
            .inner_join(question_tag::table.on(tag::id.eq(question_tag::tag_id)))
            .filter(question_tag::question_id.eq(question_id))
            .select(tag::all_columns)
            .load(connection)
            .expect("Failed to get question's tags")
}

#[tauri::command]
pub fn get_number_of_questions_with_tag(tag_id: i32) -> i64 {
    use crate::schema::question_tag;

    let connection = &mut establish_connection();

    question_tag::table
                      .filter(question_tag::tag_id.eq(tag_id))
                      .count()
                      .get_result(connection)
                      .expect("failed to fetch tag count")
}
