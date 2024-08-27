use diesel::prelude::*;
use serde::Serialize;

#[derive(Queryable, Identifiable, Selectable, Serialize)]
#[diesel(table_name = crate::schema::collection)]
#[serde(rename_all = "camelCase")]
pub struct Collection {
    pub id: i32,
    pub parent_id: Option<i32>,
    pub title: String,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::collection)]
pub struct NewCollection {
    pub title: String,
    pub parent_id: Option<i32>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CompleteCollection {
    pub id: i32,
    pub parent_id: Option<i32>,
    pub title: String,
    pub questions_collections: Vec<CompleteQuestionsCollection>,
    pub sub_collections: Vec<CompleteCollection>
}

#[derive(Queryable, Identifiable, Selectable, Serialize, Associations)]
#[diesel(table_name = crate::schema::questions_collection)]
#[diesel(belongs_to(Collection, foreign_key = parent_id))]
#[serde(rename_all = "camelCase")]
pub struct QuestionsCollection {
    pub id: i32,
    pub parent_id: i32,
    pub title: String,
}


#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CompleteQuestionsCollection {
    pub id: i32,
    pub parent_id: i32,
    pub title: String,
    pub questions: Vec<CompleteQuestion>,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::questions_collection)]
pub struct NewQuestionsCollection {
    pub title: String,
    pub parent_id: i32,
}

#[derive(Queryable, Identifiable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(table_name = crate::schema::tag)]
pub struct Tag {
    pub id: i32,
    pub color: String,
    pub label: String,
}

#[derive(Insertable, Serialize)]
#[serde(rename_all = "camelCase")]
#[diesel(table_name = crate::schema::tag)]
pub struct NewTag {
    pub label: String,
    pub color: String,
}

#[derive(Queryable, Associations, Identifiable, Selectable, Serialize)]
#[serde(rename_all = "camelCase")]
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

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CompleteQuestion {
    pub id: i32,
    pub question_number: i32,
    pub collection_id: i32,
    pub tags: Vec<Tag>
}

#[derive(Identifiable, Insertable, Selectable, Queryable, Associations)]
#[diesel(belongs_to(Tag))]
#[diesel(belongs_to(Question))]
#[diesel(primary_key(question_id, tag_id))]
#[diesel(table_name = crate::schema::question_tag)]
// FIX: Question can't have 2 of the same reason
pub struct QuestionTag {
    pub question_id: i32,
    pub tag_id: i32,
}
