<script lang="ts">
    import { active_collection } from "../../stores/active_collection_store";
    import type { QuestionsCollection } from "../../typescript/types"


    async function handleClick() {
        active_collection.set(collection)
        // active_parent.set(await getParentCollectionById(collection.parent_collection_id))
    }

    export let collection: QuestionsCollection 
    console.log(collection);
</script>

<!-- svelte-ignore a11y-<code> -->
<div on:click={handleClick}>
    <p class="item" >{collection.title}</p>
</div>

<style> 
    .item {
        margin-left: 10px;
        font-size: 20px;
    }
    .item:hover {
        color: blue;
    }
</style>
