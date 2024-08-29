<script lang="ts">
    import { get } from "svelte/store";

    import { TextBox, Button } from "fluent-svelte"
    import { active_collection } from "../../stores/active_collection_store";
    import { QUESTION_COLLECTION_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";
    import { createQuestionsCollection } from "../../../database";

    let title: string = "";

    async function handleCollectionSubmit() {
        let parentCollection = get(active_collection);
        if(parentCollection) {
            let c = await createQuestionsCollection(title, parentCollection.id);
            c.questions = [];
            let oldDB = get(QUESTION_COLLECTION_SLICE_DATABASE);
            oldDB.push(c);
            QUESTION_COLLECTION_SLICE_DATABASE.set(oldDB);
        }
    }
</script>

<form on:submit|preventDefault={handleCollectionSubmit}>
    <TextBox placeholder="Title" bind:value={title} type="text"/>
    <Button variant="accent">Add</Button>
</form>

