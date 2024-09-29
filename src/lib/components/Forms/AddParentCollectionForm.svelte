<script lang="ts">
    import { get } from "svelte/store";

    import { createCollection } from "../../../database";
    import { TextBox, Button } from "fluent-svelte"
    import { PARENTS_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";

    let title: string = "";

    async function handleCollectionSubmit() {
        let c = await createCollection(title);
        c.questionsCollections = [];
        c.subCollections = [];
        let oldDB = get(PARENTS_SLICE_DATABASE);
        oldDB.push(c);
        PARENTS_SLICE_DATABASE.set(oldDB);
    }

    // async function handleNestedCollectionSubmit(e: CustomEvent) {
    //     let parent = await createCollection(e.detail.title);
    //     parent.childCollections = []
    //     parent.subCollections = []
    //     console.log({parent});
    //
    //     const oldDB = parentCollections;
    //     oldDB.push(parent);
    //     PARENTS_SLICE_DATABASE.set(oldDB);
    // }
</script>

<form class="form" on:submit|preventDefault={handleCollectionSubmit}>
    <TextBox placeholder="Parent Title..." bind:value={title}/>
    <Button variant="variant">Add</Button>
</form>

<style>
    .form {
        display: flex;
    }
</style>
