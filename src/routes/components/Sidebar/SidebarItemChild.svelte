<script lang="ts">
    import { getCollectionById, getParentCollectionById } from "../../../database";
    import { active_parent } from "../../active-parent-store";
    import { active_collection } from "../../active_collection_store";


    async function handleClick() {
        let collection = await getCollectionById(id)
        active_collection.set(collection)
        active_parent.set(await getParentCollectionById(collection.parent_collection_id))
    }

    export let id: number, name: string="Untitled";
</script>

<!-- svelte-ignore a11y-<code> -->
<div class="item" on:click={handleClick}>
    <p>{name}</p>
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
