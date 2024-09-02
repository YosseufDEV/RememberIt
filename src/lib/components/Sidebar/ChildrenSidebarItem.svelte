<script lang="ts">
    import EditableText from "$lib/GenericComponents/EditableText.svelte";
import Seperator from "$lib/GenericComponents/Seperator.svelte";
    import { updateQuestionsCollectionTitleById } from "../../../database";
    import { active_collection } from "../../stores/active_collection_store";
    import type { QuestionsCollection } from "../../typescript/types"


    async function handleClick() {
        active_collection.set(collection)
        // active_parent.set(await getParentCollectionById(collection.parent_collection_id))
    }

    async function handleTitleUpdate(e: CustomEvent) {
        const newTitle = e.detail.newText;

        await updateQuestionsCollectionTitleById(collection.id, newTitle)
    }

    export let collection: QuestionsCollection;
</script>

<div on:click={handleClick}>
    <EditableText on:finishedEditing={handleTitleUpdate} class="questions-collection-item" text={collection.title} />
    <!-- FIX : This has a higher index than the badge explanation -->
    <!-- <Seperator color="#3e3e3e" /> -->
</div>

<style> 
    div {
        z-index: 11;
    }
    :global(.questions-collection-item) {
        font-size: 20px;
        color: lightgray;
        width: fit-content;
    }
    :global(.questions-collection-item):hover {
        color: blue;
    }
</style>
