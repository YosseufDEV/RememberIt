import { writable } from "svelte/store";
import { getAllQuestionsTags, loadSQLITEDatabase } from "../../../database"
import type { Collection, QuestionsCollection, QuestionSpecificTag, QuestionType, Tag } from "../types"
import Database from "@tauri-apps/plugin-sql";

const db = await loadSQLITEDatabase();

export const DATABASE = writable<Database>(db);

export const TAGS_SLICE_DATABASE = writable<Tag[]>(db.tags);
export const PARENTS_SLICE_DATABASE = writable<Collection[]>(db.unnested);
export const ALL_PARENTS_SLICE_DATABASE = writable<Collection[]>(db.parents);
export const QUESTION_COLLECTION_SLICE_DATABASE = writable<QuestionsCollection[]>(db.questionCollections);
export const QUESTION_TAGS_COLLECTION_SLICE_DATABASE = writable<QuestionSpecificTag[]>(await getAllQuestionsTags());
export const QUESTION_TYPES_SLICE_DATABASE = writable<QuestionType[]>(db.types);
