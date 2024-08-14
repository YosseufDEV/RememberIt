use diesel::prelude::*;
use serde::Serialize;

#[derive(Queryable, Identifiable, Selectable, Serialize)]
#[diesel(table_name = crate::schema::questions_collection)]
pub struct QuestionsCollection {
    pub id: i32,
    pub title: String,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::questions_collection)]
pub struct NewQuestionsCollection {
    pub title: String,
}

#[derive(Serialize)]
pub struct ReturnedQuestionsCollection {
    pub id: i32,
    pub title: String,
    pub questions: Vec<Question>,
}

#[derive(Queryable, Associations, Identifiable, Selectable, Serialize)]
#[diesel(belongs_to(QuestionsCollection, foreign_key = collection_id))]
#[diesel(table_name = crate::schema::question)]
pub struct Question {
    pub id: i32,
    pub question_number: i32,
    pub collection_id: i32,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::question)]
pub struct NewQuestion {
    pub question_number: i32,
    pub collection_id: i32,
}
