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
pub fn get_parent_collection_by_id(p_id: i32) -> ReturnedParentCollection {
    use crate::schema::parent_collection::dsl::*;

    let connection = &mut establish_connection();

    let collection: ParentCollection = parent_collection
                        .filter(id.to_owned().eq(p_id))
                        .first(connection)
                        .expect("Failed to fetch parent collection");
    let child_collections = get_collections_by_parent_id(p_id);

    ReturnedParentCollection {
        id: collection.id,
        title: collection.title,
        child_collections
    }
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

        let whole_collection = ReturnedParentCollection {
            id: collection.id,
            title: collection.title.clone(),
            child_collections: questions_collection,
        };

        whole_collections.push(whole_collection);
    }
    whole_collections
}
