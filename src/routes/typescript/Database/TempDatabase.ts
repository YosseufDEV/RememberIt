import { writable } from "svelte/store";
import type { ParentCollection, Question, Reason } from "../types"

interface Database {
    parents: ParentCollection[],
    questions: Question[],
    tags: Reason[],
}

let d: Database = {
    parents: [],
    questions: [],
    tags: [],
}

export const TEMP_DATABASE = writable<Database>(d);
