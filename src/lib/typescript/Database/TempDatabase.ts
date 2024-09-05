import { writable } from "svelte/store";
import type { Collection, Question, Tag } from "$lib/typescript/types.ts"

interface Database {
    parents: Collection[],
    questions: Question[],
    tags: Tag[],
}

let d: Database = {
    parents: [],
    questions: [],
    tags: [],
}

export const TEMP_DATABASE = writable<Database>(d);
