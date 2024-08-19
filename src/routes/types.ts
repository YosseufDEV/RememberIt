export interface Reason {
    id: number,
    label: string,
    color: string,
}

export interface ParentCollection {
    id: number,
    title: string,
    parent_id: number,
    child_collections: QuestionsCollection[]
    nested_parent_collections: ParentCollection[]
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
    reasons: string[],
}
