export interface Tag {
    id: number,
    label: string,
    color: string,
}

export interface ICollection {
    id: number,
    title: string,
    parentId: number,
}

export interface Collection extends ICollection {
    questionsCollections: QuestionsCollection[]
    subCollections: Collection[]
}

export interface QuestionsCollection extends ICollection {
    questions: Question[]
}

export interface Question {
    id: number,
    questionNumber: number,
    collectionId: number,
    tags: Tag[],
}

export interface DropZone {
    top: number,
    left: number,
    width: number,
    height: number,
    hoverEnterCallback: Function,
    hoverLeaveCallback: Function,
    dropCallback: Function
}

