<script lang="ts">
    import { questions_collection } from "../selected-questions-store";
    import { invoke } from "@tauri-apps/api/core";


    async function handleClick(e: MouseEvent) {
        questions_collection.set(await invoke("get_questions_by_collection_id", { id: id }))
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
