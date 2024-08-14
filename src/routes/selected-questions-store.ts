import { writable } from "svelte/store";
import type { QuestionsCollection } from "./types"

export const questions_collection = writable<QuestionsCollection>();
