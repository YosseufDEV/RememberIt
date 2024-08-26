use diesel::prelude::*;
use crate::database::establish_connection;
use crate::models::{ Reason, NewReason };

use crate::schema::reason;

#[tauri::command]
pub fn insert_reason(label: String, color: String) -> Reason {
    let reason = NewReason {
        label,
        color,
    };

    let connection = &mut establish_connection();

    diesel::dsl::insert_into(reason::table)
                 .values(&reason)
                 .returning(Reason::as_returning())
                 .get_result(connection)
                 .expect("Failed to add reason")
}

#[tauri::command]
pub fn get_reasons() -> Vec<Reason> {
    let connection = &mut establish_connection();

    reason::dsl::reason
                    .select(Reason::as_select())
                    .load(connection)
                    .expect("Failed to Get Reasons")
}

#[tauri::command]
pub fn get_reason_by_id(reason_id: i32) -> Vec<Reason> {
    let connection = &mut establish_connection();

    reason::dsl::reason
                    .select(Reason::as_select())
                    .filter(reason::id.eq(reason_id))
                    .load(connection)
                    .expect("Failed to Get Reasons")
}
