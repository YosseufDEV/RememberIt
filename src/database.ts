import { invoke } from "@tauri-apps/api/core";
import type { QuestionsCollection } from "./routes/types";

let DATABASE: QuestionsCollection[] = [ ]

async function loadDatabase() {
    DATABASE = await invoke("get_all_collections");
}

async function getCollectionTitles() {
     return await invoke("get_collections_titles");
}

async function createCollection(title: string) {
     return await invoke("create_collection", { title });
}

async function insertQuestionByCollectionId(question_number: number, id: string) {
     return await invoke("insert_question_by_collection_id", { question_number, collection_id: id });
}

async function getQuestionsByCollectionId(id: string) {
     return await invoke("get_question_by_collection_id", { collection_id: id });
}


function updateDatabase(newDatabase: QuestionsCollection[]) {
    DATABASE = newDatabase;
}


export { loadDatabase, DATABASE }; 
