import { writable } from "svelte/store";

import type { DropZone } from "../typescript/types";

export const DropZones = writable<DropZone[]>([]);
