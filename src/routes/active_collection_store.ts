import { writable } from "svelte/store";
import type { ParentCollection, QuestionsCollection } from "./types"

export const active_collection = writable<ParentCollection | QuestionsCollection>();
