<script lang="ts">  
    import SuperCollectionView from "./Views/DisplayArea/SuperCollectionView.svelte";
    import QuestionsCollectionView from "./Views/DisplayArea/QuestionsCollectionView.svelte";

    import type { QuestionsCollection, Collection, Question } from "../typescript/types"
    import { active_collection } from "../stores/active_collection_store";
    import DropZone from "./DragAndDrop/DropZone.svelte";
    import { Button } from "fluent-svelte";

    $: activeCollection = { id: -1, title: "UNTITLED" } as Collection | QuestionsCollection
    let ref: HTMLElement;

    function handleDraggableDrop() {
        console.log("dropped item");
    }

    function handleHoverEnter() {
        ref.style.background = 'blue'; 
    }

    function filterCollection() {
    }

    active_collection.subscribe((collection) => {
    activeCollection = collection});

</script>

<div class="main-container" bind:this={ref}>
    <Button on:click={filterCollection}>Filter</Button>
    <DropZone on:dropevent={handleDraggableDrop} on:hoverenter={handleHoverEnter} >
        <div class="container">
            {#if 'questions' in activeCollection}
                <QuestionsCollectionView questionsCollection={activeCollection} />
            {:else if activeCollection.id > 0}
                <SuperCollectionView superCollection={activeCollection}/>
            {/if}
        </div>
    </DropZone>
</div>

<style>
    .main-container {
        background: rgba(0, 0, 0, 0.7);
        width: 100%;
        padding-top: 40px;
        padding-bottom: 10px;
        padding-left: 25px;
    }
    .container {
        overflow-y: scroll;
        width: calc(100% - 5px);
        height: 100%;
    }
</style>
