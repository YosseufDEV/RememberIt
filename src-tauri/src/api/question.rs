use diesel::prelude::*;

use crate::database::establish_connection;
use crate::models::*;
use crate::api::question_tag::get_question_tags_by_id;

#[tauri::command]
pub fn insert_question_by_collection_id(question_number: i32, collection_id: i32) -> Question {
    use crate::schema::question;

    let conn = &mut establish_connection();

    let question = NewQuestion {
        question_number,
        collection_id
    };

    diesel::insert_into(question::table)
            .values(&question)
            .returning(Question::as_returning())
            .get_result(conn)
            .expect("Failed to insert question")
}

#[tauri::command]
pub fn get_questions_by_collection_id(col_id: i32) -> Vec<CompleteQuestion> {
    use crate::schema::question::dsl;

    let connection = &mut establish_connection();

    let mut complete_questions: Vec<CompleteQuestion> = Vec::new();

    let questions: Vec<Question> = dsl::question
                                    .filter(dsl::collection_id.eq(col_id))
                                    .order_by(dsl::question_number.asc())
                                    .select(Question::as_select()).load(connection)
                                    .expect("Failed to fetch questions for collection");
    for question in questions.iter() {
        let tags = get_question_tags_by_id(question.id);
        let question = CompleteQuestion {
            id: question.id,
            question_number: question.question_number,
            collection_id: question.collection_id,
            tags
        };
        complete_questions.push(question);
    }
    complete_questions
}

#[tauri::command]
pub fn get_question_by_question_number(col_id: i32, question_number: i32) -> CompleteQuestion {
    use crate::schema::question::dsl;

    let connection = &mut establish_connection();

    let question: Question = dsl::question
                                    .filter(
                                        dsl::collection_id
                                        .eq(col_id)
                                        .and(dsl::question_number.eq(question_number))
                                    )
                                    .first(connection)
                                    .expect("Failed to fetch questions for collection");

    let tags = get_question_tags_by_id(question.id);

    CompleteQuestion {
        id: question.id,
        question_number: question.question_number,
        collection_id: question.collection_id,
        tags
    }

}

#[tauri::command]
pub fn update_question_number_by_id(question_id: i32, new_question_number: i32) {
    use crate::schema::question::dsl;

    let connection = &mut establish_connection();

    diesel::update(dsl::question)
            .filter(dsl::id.eq(question_id))
            .set(dsl::question_number.eq(new_question_number))
            .execute(connection)
            .expect("Failed to update question_number");
}
