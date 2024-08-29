export interface Tag {
    id: number,
    label: string,
    color: string,
}

export enum CollectionType {
    COLLECTION,
    QUESTION_COLLECTION
}

export interface GenericCollection {
    id: number,
    title: string,
    parentId: number,
    identifiy(): CollectionType;
}

export interface Collection extends GenericCollection {
    questionsCollections: QuestionsCollection[]
    subCollections: Collection[],
    identifiy: () => CollectionType.COLLECTION
}

export interface QuestionsCollection extends GenericCollection {
    questions: Question[]
    identifiy: () => CollectionType.QUESTION_COLLECTION
}

export interface Question {
    id: number,
    questionNumber: number,
    collectionId: number,
    tags: Tag[],
}

export enum DraggableItemType {
    TAG,
}

export interface DropZone {
    top: number,
    left: number,
    width: number,
    height: number,
    hoverEnterCallback: Function,
    hoverLeaveCallback: Function,
    dropCallback: (itemMetadata: Object) => void;
}
