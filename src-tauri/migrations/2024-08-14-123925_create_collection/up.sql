-- Your SQL goes here
CREATE TABLE collection (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    parent_id INTEGER,
    title TEXT NOT NULL,
    FOREIGN KEY(parent_id) REFERENCES collection(id) ON DELETE CASCADE 
);
