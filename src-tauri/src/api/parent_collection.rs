use diesel::prelude::*;
use crate::database::establish_connection;
use crate::models::*;
use crate::question_collection::get_collections_by_parent_id;

#[tauri::command]
pub fn create_parent_collection(title: String) -> ParentCollection {
    use crate::schema::parent_collection;

    let conn = &mut establish_connection();

    let collection = NewParentCollection { title };

    diesel::insert_into(parent_collection::table)
            .values(&collection)
            .returning(ParentCollection::as_returning())
            .get_result(conn)
            .expect("Failed to insert collection")
}

#[tauri::command]
pub fn insert_nested_parent_collection(title: String, parent_id: i32) -> ParentCollection {
    use crate::schema::parent_collection;

    let connection = &mut establish_connection();

    let parent_collection = NewNestedParentCollection {
        parent_id,
        title
    };

    diesel::insert_into(parent_collection::table)
            .values(&parent_collection)
            .returning(ParentCollection::as_returning())
            .get_result(connection)
            .expect("Failed to insert parent collection")
}

fn get_parent_collection_nested_collections_by_id(connection: &mut SqliteConnection, p_id: i32) -> Vec<ReturnedParentCollection> {
    use crate::schema::parent_collection::dsl::*;

    let nested_collections = parent_collection
                                .filter(parent_id.eq(p_id)
                                        .and(parent_id.is_not_null()))
                                .select(ParentCollection::as_select())
                                .load(connection)
                                .expect("Failed to get nested collections");
    let mut complete_nested_collections: Vec<ReturnedParentCollection> = Vec::new();

    for collection in nested_collections.iter() {
        let questions_collection = get_collections_by_parent_id(collection.id);
        let complete_parent = ReturnedParentCollection {
            id: collection.id,
            parent_id: collection.parent_id,
            title: collection.title.clone(),
            child_collections: questions_collection,
            nested_parent_collections: get_parent_collection_nested_collections_by_id(connection, collection.id) 
        };
        complete_nested_collections.push(complete_parent);
    }
    complete_nested_collections
}

#[tauri::command]
pub fn get_parent_collection_by_id(p_id: i32) -> ReturnedParentCollection {
    use crate::schema::parent_collection::dsl::*;

    let connection = &mut establish_connection();

    let collection: ParentCollection = parent_collection
                        .filter(id.eq(p_id))
                        .first(connection)
                        .expect("Failed to fetch parent collection");
    let child_collections = get_collections_by_parent_id(p_id);
    let nested_collections = get_parent_collection_nested_collections_by_id(connection, p_id);

    ReturnedParentCollection {
        id: collection.id,
        parent_id: collection.parent_id,
        title: collection.title,
        nested_parent_collections: nested_collections,
        child_collections
    }
}

#[tauri::command]
pub fn get_all_unnested_parents() -> Vec<ReturnedParentCollection> {
    use crate::schema::parent_collection::dsl::*;

    let connection = &mut establish_connection();

    let mut whole_collections: Vec<ReturnedParentCollection> = Vec::new();
    let selected_parent_collections = parent_collection
        .filter(parent_id.is_null())
        .select(ParentCollection::as_select())
        .load(connection)
        .expect("Failed to fetch parent collection");
    for collection in selected_parent_collections.iter() {
        let questions_collection = get_collections_by_parent_id(collection.id);
        let nested_collections = get_parent_collection_nested_collections_by_id(connection, collection.id);

        let whole_collection = ReturnedParentCollection {
            id: collection.id,
            parent_id: collection.parent_id,
            nested_parent_collections: nested_collections,
            title: collection.title.clone(),
            child_collections: questions_collection,
        };
        whole_collections.push(whole_collection);
    }
    whole_collections
}

#[tauri::command]
pub fn get_all_parent_collections() -> Vec<ReturnedParentCollection> {
    use crate::schema::parent_collection::dsl::*;

    let connection = &mut establish_connection();

    let mut whole_collections: Vec<ReturnedParentCollection> = Vec::new();
    let selected_parent_collections = parent_collection
        .select(ParentCollection::as_select())
        .load(connection)
        .expect("Failed to fetch parent collection");
    for collection in selected_parent_collections.iter() {
        let questions_collection = get_collections_by_parent_id(collection.id);
        let nested_collections = get_parent_collection_nested_collections_by_id(connection, collection.id);

        let whole_collection = ReturnedParentCollection {
            id: collection.id,
            parent_id: collection.parent_id,
            nested_parent_collections: nested_collections,
            title: collection.title.clone(),
            child_collections: questions_collection,
        };

        whole_collections.push(whole_collection);
    }
    whole_collections
}
