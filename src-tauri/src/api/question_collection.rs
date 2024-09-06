use diesel::prelude::*;

use crate::api::question::get_questions_by_collection_id;
use crate::database::establish_connection;
use crate::models::*;

#[tauri::command]
pub fn create_questions_collection(title: String, parent_id: i32) -> QuestionsCollection {
    use crate::schema::questions_collection;

    let conn = &mut establish_connection();

    let collection = NewQuestionsCollection {
        parent_id,
        title,
        updated_at: None,
    };

    diesel::insert_into(questions_collection::table)
        .values(&collection)
        .returning(QuestionsCollection::as_returning())
        .get_result(conn)
        .expect("Failed to insert collection")
}

#[tauri::command]
pub fn delete_questions_collection_by_id(col_id: i32) {
    use crate::schema::questions_collection::dsl::*;

    let connection = &mut establish_connection();

    diesel::delete(questions_collection.filter(id.eq(col_id))).execute(connection);
}

#[tauri::command]
pub fn get_questions_collection_by_id(col_id: i32) -> CompleteQuestionsCollection {
    use crate::schema::questions_collection::dsl::*;

    let connection = &mut establish_connection();

    let collection: QuestionsCollection = questions_collection
        .filter(id.eq(col_id))
        .first(connection)
        .expect("Failed to insert collection");
    let questions: Vec<CompleteQuestion> = get_questions_by_collection_id(collection.id);

    CompleteQuestionsCollection {
        title: collection.title,
        id: collection.id,
        parent_id: collection.parent_id,
        created_at: collection.created_at,
        updated_at: collection.updated_at,
        questions,
    }
}

#[tauri::command]
pub fn get_collections_by_parent_id(par_id: i32) -> Vec<CompleteQuestionsCollection> {
    use crate::schema::questions_collection::dsl::*;

    let connection = &mut establish_connection();
    let mut collections_vec = Vec::new();

    let collections: Vec<QuestionsCollection> = questions_collection
        .filter(parent_id.eq(par_id))
        .select(QuestionsCollection::as_select())
        .load(connection)
        .expect("Failed to insert collection");
    for collection in collections.iter() {
        let selected_questions: Vec<CompleteQuestion> =
            get_questions_by_collection_id(collection.id);
        let whole_collection = CompleteQuestionsCollection {
            id: collection.id,
            title: collection.title.clone(),
            created_at: collection.created_at,
            updated_at: collection.updated_at,
            questions: selected_questions,
            parent_id: par_id,
        };
        collections_vec.push(whole_collection);
    }
    collections_vec
}

#[tauri::command]
pub fn get_all_questions_collections() -> Vec<CompleteQuestionsCollection> {
    use crate::schema::questions_collection::dsl::*;

    let connection = &mut establish_connection();
    let mut complete_collections: Vec<CompleteQuestionsCollection> = Vec::new();
    let selected_collections = questions_collection
        .select(QuestionsCollection::as_select())
        .load(connection)
        .expect("Failed to select collections");
    for collection in selected_collections.iter() {
        let questions: Vec<CompleteQuestion> = get_questions_by_collection_id(collection.id);
        let complete_collection = CompleteQuestionsCollection {
            id: collection.id,
            title: collection.title.clone(),
            parent_id: collection.parent_id,
            created_at: collection.created_at,
            updated_at: collection.updated_at,
            questions,
        };
        complete_collections.push(complete_collection)
    }
    complete_collections
}

#[tauri::command]
pub fn get_collections_titles() -> Vec<QuestionsCollection> {
    use crate::schema::questions_collection::dsl::*;

    let connection = &mut establish_connection();

    questions_collection
        .select(QuestionsCollection::as_select())
        .load(connection)
        .expect("Failed to select collections")
}

#[tauri::command]
pub fn update_question_collection_title_by_id(collection_id: i32, new_title: String) {
    use crate::schema::questions_collection::dsl::*;

    let connection = &mut establish_connection();

    diesel::update(questions_collection)
        .filter(id.eq(collection_id))
        .set((
            title.eq(new_title),
            updated_at.eq(chrono::Utc::now().naive_utc()),
        ))
        .execute(connection)
        .expect("Failed to update collection title");
}

pub fn update_question_collection_updated_at(collection_id: i32) {
    use crate::schema::questions_collection::dsl::*;

    let connection = &mut establish_connection();

    diesel::update(questions_collection)
        .filter(id.eq(collection_id))
        .set(updated_at.eq(chrono::Utc::now().naive_utc()))
        .execute(connection)
        .expect("Failed to update collection title");
}
