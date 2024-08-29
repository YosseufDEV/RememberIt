<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { TextBox, Button } from "fluent-svelte"
    import { get } from "svelte/store";
    import { active_parent } from "../../stores/active-parent-store";
    import { PARENTS_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";
    import { createCollection } from "../../../database";

    let title: string = "";

    async function handleNestedCollectionSubmit() {
        let parents = get(PARENTS_SLICE_DATABASE);
        let active = get(active_parent)
        const index = parents.findIndex((pCol) => pCol.id == active.id);

        // FIX: it will throw and error when add in nested.
        if(index != -1) {
            let parent = await createCollection(title, active.id);

            parent.questionsCollections = []
            parent.subCollections = []

            // TODO: Implement reactive nested parent rendering.
            // while(parentId != null) {
            //     let t = parents.filter((p) => p.id == parentId)[0]; 
            //     parentId = t.parent_id;
            //     if(parentId != null) {
            //         parentsId.push(parentId);
            //     } else {
            //         parentsId.push(t.id);
            //     }
            // }

            const oldDB = parents; 
            oldDB[index].subCollections.push(parent);
            PARENTS_SLICE_DATABASE.set(oldDB);
        }
    }
</script>

<form on:submit|preventDefault={handleNestedCollectionSubmit}>
    <TextBox placeholder="Nested Parent Title" bind:value={title} type="text"/>
    <Button variant="accent">Add</Button>
</form>

