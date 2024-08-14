<script lang="ts">
    import { getCollectionById } from "../../database";
    import { questions_collection } from "../selected-questions-store";
    import { invoke } from "@tauri-apps/api/core";


    async function handleClick(e: MouseEvent) {
        questions_collection.set(await getCollectionById(id))
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
