import { derived, writable } from "svelte/store";
import { getAllQuestionsTags, loadSQLITEDatabase } from "../../../database"
import type { Collection, QuestionsCollection, QuestionSpecificTag, QuestionType, Tag } from "../types"
import type { Database } from "../../../database.ts";

const db = await loadSQLITEDatabase();

export const DATABASE = writable<Database>(db);

export const TAGS_SLICE_DATABASE = derived<Database, Tag[]>(DATABASE, ($db: Database) => $db.tags);
export const PARENTS_SLICE_DATABASE = derived<Database, Collection[]>(DATABASE, ($db) => $db.unnested);
export const ALL_PARENTS_SLICE_DATABASE = derived<Database, Collection[]>(DATABASE, ($db) => $db.parents);
export const QUESTION_COLLECTION_SLICE_DATABASE = derived<Database, QuestionsCollection[]>(DATABASE, ($db) => $db.questionCollections);
export const QUESTION_TAGS_COLLECTION_SLICE_DATABASE = derived<Database, QuestionSpecificTag[]>(DATABASE, ($db) => $db.questionTags);
export const QUESTION_TYPES_SLICE_DATABASE = derived<Database, QuestionType[]>(DATABASE, ($db) => $db.types);
