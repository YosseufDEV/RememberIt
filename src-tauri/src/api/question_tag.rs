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
            .select((tag::all_columns, question_tag::explanation))
            .load::<(Tag, Option<String>)>(connection)
            .expect("Failed to get question's tags");
    object  
        .into_iter()
        .map(|(tag, explanation)| QuestionSpecificTag { id: tag.id, label: tag.label, color: tag.color, explanation })
        .collect()
}
