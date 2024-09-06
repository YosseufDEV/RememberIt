import { writable } from "svelte/store";
import { getAllQuesitonsCollections, getAllCollections, getAllTags, getAllQuestionsTags } from "../../../database"
import type { Collection, QuestionsCollection, QuestionSpecificTag, Tag } from "../types"
import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";

interface Database {
    parents: Collection[],
    unnested: Collection[],
    tags: Tag[],
    questionCollections: QuestionsCollection[],
}

async function loadSQLITEDatabase(): Promise<Database> {
    let unnested = await getAllCollections(true);
    let parents = await getAllCollections();
    let tags = await getAllTags();
    let questionCollections = await getAllQuesitonsCollections();
    return {
        parents,
        unnested,
        tags,
        questionCollections
    }
}

// TODO: do this!
async function exportDatabaseAsJSON() {
    const object = JSON.stringify(db);
    writeTextFile('save.json', object, {
        baseDir: BaseDirectory.Desktop
    }) 
}

const db = await loadSQLITEDatabase();
export const DATABASE = writable<Database>(db);
export const TAGS_SLICE_DATABASE = writable<Tag[]>(db.tags);
export const PARENTS_SLICE_DATABASE = writable<Collection[]>(db.unnested);
export const ALL_PARENTS_SLICE_DATABASE = writable<Collection[]>(db.parents);
export const QUESTION_COLLECTION_SLICE_DATABASE = writable<QuestionsCollection[]>(db.questionCollections);
export const QUESTION_TAGS_COLLECTION_SLICE_DATABASE = writable<QuestionSpecificTag[]>(await getAllQuestionsTags());

// exportDatabaseAsJSON();
