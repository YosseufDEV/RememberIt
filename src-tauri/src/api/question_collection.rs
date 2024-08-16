use diesel::prelude::*;

use crate::database::establish_connection;
use crate::models::*;
use crate::api::question::get_questions_by_collection_id;

#[tauri::command]
pub fn create_collection(title: String, parent_collection_id: i32) -> QuestionsCollection {
    use crate::schema::questions_collection;

    let conn = &mut establish_connection();

    let collection = NewQuestionsCollection {
        parent_collection_id,
        title
    };

    diesel::insert_into(questions_collection::table)
            .values(&collection)
            .returning(QuestionsCollection::as_returning())
            .get_result(conn)
            .expect("Failed to insert collection")
}

#[tauri::command]
pub fn get_collection_by_id(col_id: i32) -> ReturnedQuestionsCollection {
    use crate::schema::questions_collection::dsl::*;
    use crate::schema::question::dsl::{question, collection_id};

    let connection = &mut establish_connection();

    let collection: QuestionsCollection = questions_collection.filter(id.eq(col_id))
                                                              .first(connection)
                                                              .expect("Failed to insert collection");
    let questions: Vec<ReturnedQuestion> = get_questions_by_collection_id(collection.id);

    ReturnedQuestionsCollection {
        title: collection.title,
        id: collection.id,
        parent_collection_id: collection.parent_collection_id, 
        questions
    }
}

#[tauri::command]
pub fn get_collections_by_parent_id(par_id: i32) -> Vec<ReturnedQuestionsCollection> {
    use crate::schema::questions_collection::dsl::*;
    use crate::schema::question::dsl::{question, collection_id};

    let connection = &mut establish_connection();
    let mut collections_vec = Vec::new();

    let collections: Vec<QuestionsCollection> = questions_collection
                                                .filter(parent_collection_id.eq(par_id))
                                                .select(QuestionsCollection::as_select())
                                                .load(connection)
                                                .expect("Failed to insert collection");
    for collection in collections.iter() {
        let selected_questions: Vec<ReturnedQuestion> = get_questions_by_collection_id(collection.id);
        let whole_collection = ReturnedQuestionsCollection {
            id: collection.id,
            title: collection.title.clone(),
            questions: selected_questions,
            parent_collection_id: par_id
        };
        collections_vec.push(whole_collection);
    }
    collections_vec
}

#[tauri::command]
pub fn get_all_collections() -> Vec<ReturnedQuestionsCollection> {
    use crate::schema::questions_collection::dsl::*;

    let connection = &mut establish_connection();
    let mut complete_collections: Vec<ReturnedQuestionsCollection> = Vec::new();
    let selected_collections = questions_collection
                        .select(QuestionsCollection::as_select())
                        .load(connection)
                        .expect("Failed to select collections");
    for collection in selected_collections.iter() {
        let questions: Vec<ReturnedQuestion> = get_questions_by_collection_id(collection.id);
        let complete_collection = ReturnedQuestionsCollection {
            id: collection.id,
            title: collection.title.clone(),
            parent_collection_id: collection.id,
            questions
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
