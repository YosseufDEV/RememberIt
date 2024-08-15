<script lang="ts">
    import { getCollectionById } from "../../database";
    import { active_collection } from "../active_collection_store";


    async function handleClick() {
        active_collection.set(await getCollectionById(id))
        console.log(await getCollectionById(id))
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
