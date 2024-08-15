export interface Reason {
    id: number,
    label: string,
}

export interface ParentCollection {
    id: number,
    title: string,
    child_collections: QuestionsCollection[]
}

export interface QuestionsCollection {
    title: string,
    id: number,
    parent_collection_id: number,
    questions: Question[]
}

export interface Question {
    id: number,
    question_number: number,
    reason: string[],
}
