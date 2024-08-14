// @generated automatically by Diesel CLI.

diesel::table! {
    parent_collection (id) {
        id -> Integer,
        title -> Text,
    }
}

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
        parent_collection_id -> Integer,
        title -> Text,
    }
}

diesel::joinable!(question -> questions_collection (collection_id));
diesel::joinable!(questions_collection -> parent_collection (parent_collection_id));

diesel::allow_tables_to_appear_in_same_query!(
    parent_collection,
    question,
    questions_collection,
);
