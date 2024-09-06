<script lang="ts">
    import { get } from "svelte/store";

    import AddQuestionForm from "./Forms/AddQuestionForm.svelte";
    import { active_collection } from "$lib/stores/active_collection_store";

    let isVisible: boolean = false;

    function handleKeyDown(e: KeyboardEvent) {
        if (e.ctrlKey && e.keyCode == 84) {
            if('questions' in get(active_collection)) 
                isVisible = !isVisible;

        }
    }

</script>

<svelte:window on:keydown={handleKeyDown}/>

<div>
    {#if isVisible}
        <div class="container" style={`display: ${isVisible};`}>
            <div class="command-bar">
                <h1>New Question</h1>
                <AddQuestionForm />
            </div>
        </div>
    {/if}
</div>
<style>
    .container {
        font-weight: bold;
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .command-bar {
        border-radius: 15px;
        z-index: 1000;
        padding: 15px;
        background: rgba(50,50,50, 0.85);
        color: white;
        backdrop-filter: blur(20px);
        height: 450px;
        width: 750px;
        margin: auto;
    }
</style>
