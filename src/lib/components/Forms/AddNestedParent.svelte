<script lang="ts">
    import { get } from "svelte/store";

    import type { Collection } from "$lib/typescript/types";
    import { createCollection } from "../../../database";
    import { active_parent } from "../../stores/active-parent-store";
    import { PARENTS_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";
    import { TextBox, Button } from "fluent-svelte"

    let title: string = "";

    function addCollectionIfSuperParent(root: Collection, collectionId: number, collectionToAdd: Collection) {
        if(root.id == collectionId) {
            root.subCollections.push(collectionToAdd);
        } else {
            for(const subCollection of root.subCollections) {
                addCollectionIfSuperParent(subCollection, collectionId, collectionToAdd); 
            }
        }
    }

    async function handleNestedCollectionSubmit() {
        let parents = get(PARENTS_SLICE_DATABASE);
        let active = get(active_parent)
        const index = parents.findIndex((pCol) => pCol.id == active.id);

        let collection = await createCollection(title, active.id);

        collection.questionsCollections = []
        collection.subCollections = []

        if(index != -1) {
            const oldDB = parents; 
            oldDB[index].subCollections.push(collection);
            PARENTS_SLICE_DATABASE.set(oldDB);
        } else {
            for(const superCollection of parents) {
                addCollectionIfSuperParent(superCollection, active.id, collection);
            }
            PARENTS_SLICE_DATABASE.set(parents);
        }
    }
</script>

<form on:submit|preventDefault={handleNestedCollectionSubmit}>
    <TextBox placeholder="Nested Parent Title" bind:value={title} type="text"/>
    <Button variant="accent">Add</Button>
</form>

