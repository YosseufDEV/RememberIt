-- Your SQL goes here
CREATE TABLE question_tag (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
    question_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    explanation TEXT,
    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);
