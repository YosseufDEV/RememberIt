-- Your SQL goes here
CREATE TABLE question_tag (
    question_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (question_id, tag_id),
    FOREIGN KEY (question_id) REFERENCES question(id),
    FOREIGN KEY (tag_id) REFERENCES tag(id)
);
