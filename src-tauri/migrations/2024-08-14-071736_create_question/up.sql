CREATE TABLE question (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    question_number INTEGER NOT NULL,
    question_type INTEGER NOT NULL,
    collection_id INTEGER NOT NULL,
    FOREIGN KEY (question_type) REFERENCES question_type(id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES questions_collection(id) ON DELETE CASCADE
);

