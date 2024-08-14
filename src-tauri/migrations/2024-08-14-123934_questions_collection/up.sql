-- Your SQL goes here
CREATE TABLE questions_collection (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    parent_collection_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    FOREIGN KEY (parent_collection_id) REFERENCES parent_collection(id)
);
