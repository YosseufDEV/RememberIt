// @generated automatically by Diesel CLI.

diesel::table! {
    parent_collection (id) {
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
    question_reason (question_id, reason_id) {
        question_id -> Integer,
        reason_id -> Integer,
    }
}

diesel::table! {
    questions_collection (id) {
        id -> Integer,
        parent_collection_id -> Integer,
        title -> Text,
    }
}

diesel::table! {
    reason (id) {
        id -> Integer,
        label -> Text,
    }
}

diesel::joinable!(question -> questions_collection (collection_id));
diesel::joinable!(question_reason -> question (question_id));
diesel::joinable!(question_reason -> reason (reason_id));
diesel::joinable!(questions_collection -> parent_collection (parent_collection_id));

diesel::allow_tables_to_appear_in_same_query!(
    parent_collection,
    question,
    question_reason,
    questions_collection,
    reason,
);
