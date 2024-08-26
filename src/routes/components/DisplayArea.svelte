<script lang="ts">  
    import AddQuestionForm from "./Forms/AddQuestionForm.svelte";
    import ParentCollectionView from "./Views/DisplayArea/ParentCollectionView.svelte";
    import ChildCollectionView from "./Views/DisplayArea/ChildCollectionView.svelte";

    import type { QuestionsCollection, ParentCollection, Question } from "../typescript/types"
    import { getQuestionByQuestionNumber, getQuestionsByCollectionId, insertQuestionByCollectionId, insertQuestionReason } from "../../database";
    import { active_collection } from "../stores/active_collection_store";
    import { TEMP_DATABASE } from "../typescript/Database/TempDatabase";
    import { get } from "svelte/store";
    import DropZone from "./DragAndDrop/DropZone.svelte";

    $: activeCollection = { id: -1, title: "UNTITLED" } as ParentCollection | QuestionsCollection

    function handleDraggableDrop() {
        console.log("dropped item");
    }

    active_collection.subscribe((collection) => activeCollection = collection);

</script>

<div class="main-container">
    <DropZone on:dropevent={handleDraggableDrop} >
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
