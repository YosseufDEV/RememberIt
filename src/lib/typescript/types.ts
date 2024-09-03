export interface Tag {
    id: number,
    label: string,
    color: string,
}

export interface QuestionSpecificTag {
    questionTagId: number,
    questionId: number,
    id: number,
    label: string,
    color: string,
    explanation: string,
}

export interface QuestionTag {
    id: number,
    tagId: number,
    questionId: number,
    explanation: string,
}

export enum CollectionType {
    COLLECTION,
    QUESTION_COLLECTION
}

export interface GenericCollection {
    id: number,
    title: string,
    parentId: number,
}

export interface Collection extends GenericCollection {
    questionsCollections: QuestionsCollection[]
    subCollections: Collection[],
}

export interface QuestionsCollection extends GenericCollection {
    questions: Question[]
    createdAt: string,
    updatedAt: string,
}

export interface Question {
    id: number,
    questionNumber: number,
    collectionId: number,
    tags: QuestionSpecificTag[],
}

export enum DraggableItemType {
    TAG,
}

export interface ItemMetadata {
    type: DraggableItemType,
}

export interface TagItemMetadata extends ItemMetadata, Tag { }

type callbackFunction = (itemMetadata: Object) => void;

export interface DropZone {
    top: number,
    left: number,
    width: number,
    height: number,
    hoverEnterCallback: callbackFunction,
    hoverLeaveCallback: callbackFunction,
    dropCallback: callbackFunction;
}
