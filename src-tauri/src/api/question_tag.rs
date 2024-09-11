use crate::database::establish_connection;
use crate::models::{NewQuestionTag, QuestionSpecificTag, QuestionTag, Tag};
use crate::question::get_question_by_id;
use crate::question_collection::update_question_collection_updated_at;
use diesel::prelude::*;

#[tauri::command]
pub fn insert_question_tag(question_id: i32, tag_id: i32, explanation: Option<String>) -> QuestionTag {
    use crate::schema::question_tag;

    let connection = &mut establish_connection();

    let question_tag_obj = NewQuestionTag {
        question_id,
        tag_id,
        explanation,
    };

    let question_tag = diesel::dsl::insert_into(question_tag::table)
        .values(&question_tag_obj)
        .returning(QuestionTag::as_returning())
        .get_result(connection)
        .expect(&format!("Failed to insert Question Tag with q_id: {}, tag_id: {}", question_id, tag_id));

    let question = get_question_by_id(question_id);
    update_question_collection_updated_at(question.collection_id);

    return question_tag;
}

#[tauri::command]
pub fn get_question_tags_by_id(question_id: i32) -> Vec<QuestionSpecificTag> {
    use crate::schema::question_tag;
    use crate::schema::tag;

    let connection = &mut establish_connection();

    let object = tag::table
        .inner_join(question_tag::table.on(tag::id.eq(question_tag::tag_id)))
        .filter(question_tag::question_id.eq(question_id))
        .select((
            tag::all_columns,
            question_tag::id,
            question_tag::question_id,
            question_tag::explanation,
        ))
        .load::<(Tag, i32, i32, Option<String>)>(connection)
        .expect("Failed to get question's tags");
    object
        .into_iter()
        .map(
            |(tag, question_tag_id, question_id, explanation)| QuestionSpecificTag {
                id: tag.id,
                label: tag.label,
                color: tag.color,
                explanation,
                question_tag_id,
                question_id,
            },
        )
        .collect()
}

#[tauri::command]
pub fn update_question_tag_explanation_by_id(question_tag_id: i32, new_explanation: String) {
    use crate::schema::question_tag::dsl::*;

    let connection = &mut establish_connection();

    let c: QuestionTag = diesel::update(question_tag)
        .filter(id.eq(question_tag_id))
        .set(explanation.eq(new_explanation))
        .get_result(connection)
        .expect("Failed to update question tag explanation");

    let question = get_question_by_id(c.question_id);
    update_question_collection_updated_at(question.collection_id);
}

#[tauri::command]
pub fn delete_question_tag_by_id(question_tag_id: i32) {
    use crate::schema::question_tag::dsl::*;

    let connection = &mut establish_connection();

    diesel::delete(question_tag.filter(id.eq(question_tag_id)))
        .execute(connection)
        .expect("Faield to delete question tag!");
}

#[tauri::command]
pub fn get_all_questions_tags() -> Vec<QuestionSpecificTag> {
    use crate::schema::question_tag;
    use crate::schema::tag;

    let connection = &mut establish_connection();

    let object = tag::table
        .inner_join(question_tag::table.on(tag::id.eq(question_tag::tag_id)))
        .select((
            tag::all_columns,
            question_tag::id,
            question_tag::question_id,
            question_tag::explanation,
        ))
        .load::<(Tag, i32, i32, Option<String>)>(connection)
        .expect("Failed to get question's tags");
    object
        .into_iter()
        .map(
            |(tag, question_tag_id, question_id, explanation)| QuestionSpecificTag {
                id: tag.id,
                label: tag.label,
                color: tag.color,
                explanation,
                question_tag_id,
                question_id,
            },
        )
        .collect()
}
