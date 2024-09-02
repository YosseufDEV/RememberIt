use diesel::prelude::*;
use crate::database::establish_connection;
use crate::models::{ Tag, NewQuestionTag, QuestionSpecificTag, QuestionTag };

#[tauri::command]
pub fn insert_question_tag(question_id: i32, tag_id: i32, explanation: Option<String>) -> QuestionTag {
    use crate::schema::question_tag;

    let connection = &mut establish_connection();
    let question_tag_obj = NewQuestionTag { question_id, tag_id, explanation };

    diesel::dsl::insert_into(question_tag::table)
                .values(&question_tag_obj)
                .returning(QuestionTag::as_returning())
                .get_result(connection)
                .expect("Failed to insert Question Tag")
}

#[tauri::command]
pub fn get_question_tags_by_id(question_id: i32) -> Vec<QuestionSpecificTag> {
    use crate::schema::question_tag;
    use crate::schema::tag;

    let connection = &mut establish_connection();

    let object = tag::table
            .inner_join(question_tag::table.on(tag::id.eq(question_tag::tag_id)))
            .filter(question_tag::question_id.eq(question_id))
            .select((tag::all_columns, question_tag::id, question_tag::explanation))
            .load::<(Tag, i32, Option<String>)>(connection)
            .expect("Failed to get question's tags");
    object  
        .into_iter()
        .map(|(tag, question_tag_id, explanation)| QuestionSpecificTag { id: tag.id, label: tag.label, color: tag.color, explanation, question_tag_id })
        .collect()
}

#[tauri::command]
pub fn update_question_tag_explanation_by_id(question_tag_id: i32, new_explanation: String) {
    use crate::schema::question_tag::dsl::*;

    let connection = &mut establish_connection();

    diesel::update(question_tag)
            .filter(id.eq(question_tag_id))
            .set(explanation.eq(new_explanation))
            .execute(connection)
            .expect("Failed to update question tag explanation");
}

#[tauri::command]
pub fn delete_question_tag_by_id(question_tag_id: i32) {
    use crate::schema::question_tag::dsl::*;

    let connection = &mut establish_connection();

    diesel::delete(question_tag.filter(id.eq(question_tag_id)))
            .execute(connection)
            .expect("Faield to delete question tag!");
}
