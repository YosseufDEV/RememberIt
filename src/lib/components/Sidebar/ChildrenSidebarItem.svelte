<script lang="ts">
    import Seperator from "$lib/GenericComponents/Seperator.svelte";
    import { active_collection } from "../../stores/active_collection_store";
    import type { QuestionsCollection } from "../../typescript/types"


    async function handleClick() {
        active_collection.set(collection)
        // active_parent.set(await getParentCollectionById(collection.parent_collection_id))
    }

    export let collection: QuestionsCollection;
</script>

<div on:click={handleClick}>
    <p class="item" >{collection.title}</p>
    <Seperator color="#3e3e3e" />
</div>

<style> 
    .item {
        font-size: 20px;
        color: lightgray;
        width: fit-content;
    }
    .item:hover {
        color: blue;
    }
</style>
