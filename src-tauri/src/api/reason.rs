use diesel::prelude::*;
use crate::database::establish_connection;
use crate::models::{ Reason, NewReason };

use crate::schema::reason;

#[tauri::command]
pub fn insert_reason(label: String) -> Reason {
    let reason = NewReason {
        label,
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
