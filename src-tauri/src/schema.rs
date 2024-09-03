// @generated automatically by Diesel CLI.

diesel::table! {
    collection (id) {
        id -> Integer,
        parent_id -> Nullable<Integer>,
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
    question_tag (id) {
        id -> Integer,
        question_id -> Integer,
        tag_id -> Integer,
        explanation -> Nullable<Text>,
    }
}

diesel::table! {
    questions_collection (id) {
        id -> Integer,
        parent_id -> Integer,
        title -> Text,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    tag (id) {
        id -> Integer,
        color -> Text,
        label -> Text,
    }
}

diesel::joinable!(question -> questions_collection (collection_id));
diesel::joinable!(question_tag -> question (question_id));
diesel::joinable!(question_tag -> tag (tag_id));
diesel::joinable!(questions_collection -> collection (parent_id));

diesel::allow_tables_to_appear_in_same_query!(
    collection,
    question,
    question_tag,
    questions_collection,
    tag,
);
