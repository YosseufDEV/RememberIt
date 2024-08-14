import { invoke } from "@tauri-apps/api/core";
import type { Question, QuestionsCollection } from "./routes/types";

let DATABASE: QuestionsCollection[] = [ ]

async function loadDatabase() {
    DATABASE = await invoke("get_all_collections");
}

async function createCollection(title: string): Promise<QuestionsCollection> {
    return await invoke("create_collection", { title });
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


function updateDatabase(newDatabase: QuestionsCollection[]) {
    DATABASE = newDatabase;
}


export { 
         getCollectionById,
         getCollectionTitles, 
         getQuestionsByCollectionId, 
         createCollection, 
         insertQuestionByCollectionId}; 
