import { writable } from "svelte/store";
import { getAllCollections, getAllParentCollections, getAllReasons } from "../../../database"
import type { ParentCollection, QuestionsCollection, Reason } from "../types"

interface Database {
    parents: ParentCollection[],
    unnestedParents: ParentCollection[],
    tags: Reason[],
    questionCollections: QuestionsCollection[],
}

async function loadSQLITEDatabase(): Promise<Database> {
    let unnestedParents = await getAllParentCollections(true);
    let parents = await getAllParentCollections();
    let tags = await getAllReasons();
    let questionCollections = await getAllCollections();
    return {
        parents,
        unnestedParents,
        tags,
        questionCollections
    }
}

const db = await loadSQLITEDatabase();
export const DATABASE = writable<Database>(db);
export const TAGS_SLICE_DATABASE = writable<Reason[]>(db.tags);
export const PARENTS_SLICE_DATABASE = writable<ParentCollection[]>(db.unnestedParents);
export const ALL_PARENTS_SLICE_DATABASE = writable<ParentCollection[]>(db.parents);
export const QUESTION_COLLECTION_SLICE_DATABASE = writable<QuestionsCollection[]>(db.questionCollections);
