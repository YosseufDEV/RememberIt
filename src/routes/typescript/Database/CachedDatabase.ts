import { writable } from "svelte/store";
import { getAllQuesitonsCollections, getAllCollections, getAllTags } from "../../../database"
import type { Collection, QuestionsCollection, Tag } from "../types"

interface Database {
    parents: Collection[],
    unnesteds: Collection[],
    tags: Tag[],
    questionCollections: QuestionsCollection[],
}

async function loadSQLITEDatabase(): Promise<Database> {
    let unnesteds = await getAllCollections(true);
    let parents = await getAllCollections();
    let tags = await getAllTags();
    let questionCollections = await getAllQuesitonsCollections();
    return {
        parents,
        unnesteds,
        tags,
        questionCollections
    }
}

const db = await loadSQLITEDatabase();
export const DATABASE = writable<Database>(db);
export const TAGS_SLICE_DATABASE = writable<Tag[]>(db.tags);
export const PARENTS_SLICE_DATABASE = writable<Collection[]>(db.unnesteds);
export const ALL_PARENTS_SLICE_DATABASE = writable<Collection[]>(db.parents);
export const QUESTION_COLLECTION_SLICE_DATABASE = writable<QuestionsCollection[]>(db.questionCollections);
