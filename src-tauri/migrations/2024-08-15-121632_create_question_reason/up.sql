-- Your SQL goes here
CREATE TABLE question_reason (
    question_id INTEGER NOT NULL,
    reason_id INTEGER NOT NULL,
    PRIMARY KEY (question_id, reason_id),
    FOREIGN KEY (question_id) REFERENCES question(id),
    FOREIGN KEY (reason_id) REFERENCES reason(id)
);
