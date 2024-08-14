export enum Reason {
    DIDNT_THINK = "Didn't Think",
    COULDNT_UNDERSTAND = "Couldn't Understand",
    COULDNT_RECALL = "Couldn't Recall",
}

export interface QuestionsCollection {
    title: string,
    id: number,
    questions: Question[]
}

export interface Question {
    question_number: number,
    reason: Reason[],
}
