use diesel::prelude::*;
use crate::database::establish_connection;
use crate::models::*;
use crate::question_collection::get_collections_by_parent_id;

#[tauri::command]
pub fn create_collection(title: String, parent_id: Option<i32>) -> Collection {
    use crate::schema::collection;

    let conn = &mut establish_connection();

    let collection = NewCollection { title, parent_id };

    diesel::insert_into(collection::table)
            .values(&collection)
            .returning(Collection::as_returning())
            .get_result(conn)
            .expect("Failed to insert collection")
}
#[tauri::command]
pub fn delete_collection_by_id(col_id: i32) {
    use crate::schema::collection::dsl::*;

    let connection = &mut establish_connection();

    diesel::delete(collection.filter(id.eq(col_id)))
            .execute(connection)
            .expect(&(format!("Failed to delete collection with id {}", col_id).to_string()));
}

fn get_collection_sub_collections_by_id(connection: &mut SqliteConnection, p_id: i32) -> Vec<CompleteCollection> {
    use crate::schema::collection;

    let sub_collections = collection::dsl::collection
                                .filter(collection::dsl::parent_id.eq(p_id)
                                        .and(collection::dsl::parent_id.is_not_null()))
                                .select(Collection::as_select())
                                .load(connection)
                                .expect("Failed to get nested collections");
    let mut complete_sub_collections: Vec<CompleteCollection> = Vec::new();

    for collection in sub_collections.iter() {
        let questions_collection = get_collections_by_parent_id(collection.id);
        let complete_parent = CompleteCollection {
            id: collection.id,
            parent_id: collection.parent_id,
            title: collection.title.clone(),
            questions_collections: questions_collection,
            sub_collections: get_collection_sub_collections_by_id(connection, collection.id) 
        };
        complete_sub_collections.push(complete_parent);
    }
    complete_sub_collections
}

#[tauri::command]
pub fn get_collection_by_id(p_id: i32) -> CompleteCollection {
    use crate::schema::collection;

    let connection = &mut establish_connection();

    let collection: Collection = collection::dsl::collection
                                    .filter(collection::dsl::id.eq(p_id))
                                    .first(connection)
                                    .expect("Failed to fetch parent collection");
    let questions_collections = get_collections_by_parent_id(p_id);
    let sub_collections = get_collection_sub_collections_by_id(connection, p_id);

    CompleteCollection {
        id: collection.id,
        parent_id: collection.parent_id,
        title: collection.title,
        sub_collections,
        questions_collections
    }
}

#[tauri::command]
pub fn get_all_super_collections() -> Vec<CompleteCollection> {
    use crate::schema::collection;

    let connection = &mut establish_connection();

    let mut whole_collections: Vec<CompleteCollection> = Vec::new();
    let selected_collections = collection::dsl::collection
                    .filter(collection::dsl::parent_id.is_null())
                    .select(Collection::as_select())
                    .load(connection)
                    .expect("Failed to fetch parent collection");
    for collection in selected_collections.iter() {
        let questions_collection = get_collections_by_parent_id(collection.id);
        let sub_collections = get_collection_sub_collections_by_id(connection, collection.id);

        let whole_collection = CompleteCollection {
            id: collection.id,
            parent_id: collection.parent_id,
            sub_collections,
            title: collection.title.clone(),
            questions_collections: questions_collection,
        };
        whole_collections.push(whole_collection);
    }
    whole_collections
}

#[tauri::command]
pub fn get_untitled_count() -> usize {
    use crate::schema::collection::dsl::*;

    let connection = &mut establish_connection();

    collection
        .filter(title.like("%Untitled%"))
        .select(Collection::as_select())
        .load(connection)
        .expect("Failed to fetch parent collection with Untitled in their names").len()
}

#[tauri::command]
pub fn get_all_collections() -> Vec<CompleteCollection> {
    use crate::schema::collection;

    let connection = &mut establish_connection();

    let mut whole_collections: Vec<CompleteCollection> = Vec::new();
    let selected_collections = collection::dsl::collection
                .select(Collection::as_select())
                .load(connection)
                .expect("Failed to fetch parent collection");
    for collection in selected_collections.iter() {
        let questions_collection = get_collections_by_parent_id(collection.id);
        let sub_collections = get_collection_sub_collections_by_id(connection, collection.id);

        let whole_collection = CompleteCollection {
            id: collection.id,
            parent_id: collection.parent_id,
            sub_collections,
            title: collection.title.clone(),
            questions_collections: questions_collection,
        };

        whole_collections.push(whole_collection);
    }
    whole_collections
}

#[tauri::command]
pub fn update_collection_title_by_id(collection_id: i32, new_title: String) {
    use crate::schema::collection::dsl::*;

    let connection = &mut establish_connection();

    diesel::update(collection)
            .filter(id.eq(collection_id))
            .set(title.eq(new_title))
            .execute(connection)
            .expect("Failed to update collection title");
}
