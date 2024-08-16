<script lang="ts">
    import { getParentCollectionById } from "../../../database";
    import { active_parent } from "../../active-parent-store";
    import { active_collection } from "../../active_collection_store";
    import type { QuestionsCollection } from "../../types"


    async function handleClick() {
        active_collection.set(collection)
        active_parent.set(await getParentCollectionById(collection.parent_collection_id))
    }

    export let collection: QuestionsCollection 
    console.log(collection);
</script>

<!-- svelte-ignore a11y-<code> -->
<div class="item" on:click={handleClick}>
    <p>{collection.title}</p>
</div>

<style> 
    .item {
        margin-left: 10px;
        font-size: 20px;
        color: grey;
    }
    .item:hover {
        color: blue;
    }
</style>
