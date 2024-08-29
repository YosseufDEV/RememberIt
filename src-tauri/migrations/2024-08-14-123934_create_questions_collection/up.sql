-- Your SQL goes here
CREATE TABLE questions_collection (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    parent_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES collection(id)
);
