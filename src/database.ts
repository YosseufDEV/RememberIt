import { invoke } from "@tauri-apps/api/core";
import type { ParentCollection, Question, QuestionsCollection, Reason } from "./routes/types";

async function createParentCollection(title: string) {
    await invoke("create_parent_collection", { title })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
}

async function getAllParentCollections(): Promise<ParentCollection[]> {
    return await invoke("get_all_parent_collections");
}

async function getCollectionsByParentId(id: number): Promise<QuestionsCollection[]> {
    return await invoke("get_collections_by_parent_id", { parId: id })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
}

async function getParentCollectionById(id: number): Promise<ParentCollection> {
    return await invoke("get_parent_collection_by_id", { pId: id  })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
}

async function createCollection(title: string, parentId: number): Promise<QuestionsCollection> {
    return await invoke("create_collection", { title, parentCollectionId: parentId });
}

async function getCollectionTitles(): Promise<{ id: number, title: string }[]> {
     return await invoke("get_collections_titles");
}

async function getCollectionById(id: number): Promise<QuestionsCollection> {
    return await invoke("get_collection_by_id", { colId: id })
}


async function insertQuestionByCollectionId(questionNumber: number, id: number): Promise<Question> {
    return await invoke("insert_question_by_collection_id", { questionNumber, collectionId: id });
}

async function getQuestionsByCollectionId(id: number): Promise<Question[]> {
     return await invoke("get_questions_by_collection_id", { colId: id });
}

async function insertReason(label: string): Promise<string> {
    return await invoke("insert_reason", { label })
}

async function getReasons(): Promise<Reason[]> {
    return await invoke("get_reasons")
}

async function insertQuestionReason(questionId: number, reasonId: number) {
    return await invoke("insert_question_reason", { questionId, reasonId })
}

async function getQuestionReasonsById(questionId: number): Promise<string[]> {
    return await invoke("get_question_reasons_by_id", { questionId })
}

export { 
    createCollection, 
    createParentCollection,
    insertQuestionReason,
    insertQuestionByCollectionId,
    insertReason,
    getCollectionById,
    getCollectionTitles, 
    getQuestionsByCollectionId, 
    getAllParentCollections,
    getParentCollectionById,
    getCollectionsByParentId,
    getReasons,
    getQuestionReasonsById,
}; 
