<script lang="ts">
    import { getParentCollectionById } from "../../../database";
    import { active_parent } from "../../active-parent-store";
    import { active_collection } from "../../active_collection_store";


    async function handleClick(e: MouseEvent) {
        const parent = await getParentCollectionById(id)
        active_collection.set(parent)
        active_parent.set(parent)
    }

    export let id: number, name: string="Untitled";
</script>

<div class="item" on:click={handleClick}>
    <p>{name}</p>
</div>

<style> 
    .item {
        font-size: 20px;
    }
    .item:hover {
        color: red;
    }
</style>
