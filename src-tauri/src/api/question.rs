use diesel::prelude::*;

use crate::database::establish_connection;
use crate::models::*;
use crate::api::question_reason::get_question_reasons_by_id;


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
pub fn get_questions_by_collection_id(col_id: i32) -> Vec<ReturnedQuestion> {
    use crate::schema::question::dsl;

    let connection = &mut establish_connection();

    let mut complete_questions: Vec<ReturnedQuestion> = Vec::new();

    let questions: Vec<Question> = dsl::question
                                    .filter(dsl::collection_id.to_owned().eq(col_id))
                                    .select(Question::as_select()).load(connection)
                                    .expect("Failed to fetch questions for collection");
    for question in questions.iter() {
        let reasons = get_question_reasons_by_id(question.id);
        let question = ReturnedQuestion {
            id: question.id,
            question_number: question.question_number,
            collection_id: question.collection_id,
            reasons
        };
        complete_questions.push(question);
    }
    complete_questions
}
