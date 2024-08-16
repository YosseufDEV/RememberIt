-- Your SQL goes here
CREATE TABLE parent_collection (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    parent_id INTEGER,
    title TEXT NOT NULL,
    FOREIGN KEY(parent_id) REFERENCES parent_collection(id)
);
