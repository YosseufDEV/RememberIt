import { writable } from "svelte/store";
import type { ParentCollection } from "./types"

export const active_parent = writable<ParentCollection>();
