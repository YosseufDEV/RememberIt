use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;
use crate::models::*;


fn establish_connection() -> SqliteConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL is not set");
    SqliteConnection::establish(&database_url)
                        .unwrap_or_else(|_|
                            panic!("Failed to connect to database {}", database_url))
}

#[tauri::command]
pub fn create_collection(title: String) -> QuestionsCollection {
    use crate::schema::questions_collection;

    let conn = &mut establish_connection();

    let collection = NewQuestionsCollection {
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
    let questions: Vec<Question> = question.filter(collection_id.to_owned().eq(collection.id))
                                           .select(Question::as_select())
                                           .load(connection)
                                           .expect("Failed to fetch questions for collection");
    ReturnedQuestionsCollection {
        title: collection.title,
        id: collection.id,
        questions
    }
}

#[tauri::command]
pub fn insert_question_by_collection_id(question_number: i32, collection_id: i32) -> Question {
    use crate::schema::question;

    let conn = &mut establish_connection();

    let question = NewQuestion {
        question_number,
        collection_id
    };

    diesel::insert_into(question::table)
            .values(&question)
            .returning(Question::as_returning())
            .get_result(conn)
            .expect("Failed to insert question")
}

#[tauri::command]
pub fn get_questions_by_collection_id(col_id: i32) -> Vec<Question> {
    use crate::schema::question::dsl::*;

    let connection = &mut establish_connection();

    question
        .filter(collection_id.to_owned().eq(col_id))
        .select(Question::as_select()).load(connection)
        .expect("Failed to fetch questions for collection")
}

#[tauri::command]
pub fn get_all_collections() -> Vec<ReturnedQuestionsCollection> {
    use crate::schema::questions_collection::dsl::*;
    use crate::schema::question::dsl::*;

    let connection = &mut establish_connection();
    let mut complete_collections: Vec<ReturnedQuestionsCollection> = Vec::new();
    let selected_collections = questions_collection
                        .select(QuestionsCollection::as_select())
                        .load(connection)
                        .expect("Failed to select collections");
    for collection in selected_collections.iter() {
        let questions: Vec<Question> = question
                            .filter(collection_id.to_owned().eq(collection.id))
                            .select(Question::as_select()).load(connection).
                            expect("Failed to fetch questions for collection");
        let complete_collection = ReturnedQuestionsCollection {
            id: collection.id,
            title: collection.title.clone(),
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
