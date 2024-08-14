// @generated automatically by Diesel CLI.

diesel::table! {
    question (id) {
        id -> Integer,
        question_number -> Integer,
        collection_id -> Integer,
    }
}

diesel::table! {
    questions_collection (id) {
        id -> Integer,
        title -> Text,
    }
}

diesel::joinable!(question -> questions_collection (collection_id));

diesel::allow_tables_to_appear_in_same_query!(
    question,
    questions_collection,
);
