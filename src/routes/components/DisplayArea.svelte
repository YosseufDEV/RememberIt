<script lang="ts">  
    import ParentCollectionView from "./Views/DisplayArea/ParentCollectionView.svelte";
    import ChildCollectionView from "./Views/DisplayArea/ChildCollectionView.svelte";

    import { get } from "svelte/store";
    import type { QuestionsCollection, ParentCollection, Question } from "../typescript/types"
    import { active_collection } from "../stores/active_collection_store";
    import DropZone from "./DragAndDrop/DropZone.svelte";
    import { Button } from "fluent-svelte";

    $: activeCollection = get(active_collection);
    let ref: HTMLElement;

    function handleDraggableDrop() {
        console.log("dropped item");
    }

    function handleHoverEnter() {
        ref.style.background = 'blue'; 
    }

    function filterCollection() {
        // activeCollection.questions = 
        //     activeCollection.questions.filter((q) => q.reaso
    }

    active_collection.subscribe((collection) => activeCollection = collection);

</script>

<div class="main-container" bind:this={ref}>
    <Button on:click={filterCollection}>Filter</Button>
    <DropZone on:dropevent={handleDraggableDrop} on:hoverenter={handleHoverEnter} >
        <div class="container">
            {#if 'parent_collection_id' in activeCollection}
                <ChildCollectionView childCollection={activeCollection} />
            {:else if activeCollection.id > 0}
                <ParentCollectionView parentCollection={activeCollection}/>
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
