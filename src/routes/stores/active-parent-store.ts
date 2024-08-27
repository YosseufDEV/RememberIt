import { writable } from "svelte/store";
import type { ParentCollection } from "../typescript/types"

export const active_parent = writable<ParentCollection>();
export const active_parent_index = writable<number>();
