CREATE TABLE question (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    question_number INTEGER NOT NULL,
    collection_id INTEGER NOT NULL,
    FOREIGN KEY (collection_id) REFERENCES questions_collection(id)
);

