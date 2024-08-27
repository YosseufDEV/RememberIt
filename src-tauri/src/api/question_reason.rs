use diesel::prelude::*;
use crate::database::establish_connection;
use crate::models::{ QuestionReason, Reason };

#[tauri::command]
pub fn insert_question_reason(question_id: i32, reason_id: i32) {
    use crate::schema::question_reason;

    let connection = &mut establish_connection();
    let question_reason_obj = QuestionReason { question_id, reason_id };

    diesel::dsl::insert_into(question_reason::table)
                .values(&question_reason_obj)
                .execute(connection)
                .expect("Failed to insert Question Reason");
}

#[tauri::command]
pub fn get_question_reasons_by_id(question_id: i32) -> Vec<Reason> {
    use crate::schema::question_reason;
    use crate::schema::reason;

    let connection = &mut establish_connection();

    reason::table
            .inner_join(question_reason::table.on(reason::id.eq(question_reason::reason_id)))
            .filter(question_reason::question_id.eq(question_id))
            .select(reason::all_columns)
            .load(connection)
            .expect("Failed to get question's reasons")
}

#[tauri::command]
pub fn get_number_of_questions_with_reason(reason_id: i32) -> i64 {
    use crate::schema::question_reason;

    let connection = &mut establish_connection();

    question_reason::table
                      .filter(question_reason::reason_id.eq(reason_id))
                      .count()
                      .get_result(connection)
                      .expect("failed to fetch reason count")
}
