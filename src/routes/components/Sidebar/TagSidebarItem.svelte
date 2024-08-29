<script lang="ts">
    import { get } from "svelte/store";
    import { onMount } from "svelte";

    import { DraggableItemType, type QuestionsCollection, type Tag } from "../../typescript/types";
    import { QUESTION_COLLECTION_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";
    import { mutateTagToBadgeAnimation } from "../Animations/TagItemAnimations";
    import Draggable from "../DragAndDrop/Draggable.svelte";
    
    export let tag: Tag;

    let tagContainerRef: HTMLElement;
    let tagCircleRef: HTMLElement;
    let isDragged = false;


    let mutateAnimation: GSAPTimeline | null;
    $: tagCount = 0;

    function handleDragStart() {
        isDragged = true;
    }

    function getQuestionsWithTagCount() {
        let length = 0;
        let questionsCollections: QuestionsCollection[] = get(QUESTION_COLLECTION_SLICE_DATABASE);
        questionsCollections.forEach((collection) => {
            let questions = collection.questions;
            questions.forEach((q) => {
                length += q.tags.filter((r) => r.id == tag.id).length;
            })
        })
        return length;
    }

    function handleDragMove(e: CustomEvent) {
        if(!mutateAnimation) {
            mutateAnimation = mutateTagToBadgeAnimation(tagContainerRef, tagCircleRef);
        }
    }

    function handleDragStop() {
        if(mutateAnimation) {
            mutateAnimation.reverse().then((_) => mutateAnimation = null);
        }
    }

    onMount(() => {
        tagCount = getQuestionsWithTagCount();
        QUESTION_COLLECTION_SLICE_DATABASE.subscribe((_) => {
            tagCount = getQuestionsWithTagCount();
        })
    })
</script>

<Draggable bind:draggableItemMetadata={tag}
           draggableRef={tagContainerRef}
           on:dragstart={handleDragStart} 
           on:dragmove={handleDragMove} 
           on:dragdrop={handleDragStop}>
    <div class="container" bind:this={tagContainerRef}>
        <div class="color" style={`background: ${tag.color}`} bind:this={tagCircleRef}/>
        <p>{tag.label}</p>
        <!-- TODO : Hide this when dragging-->
        <div class="questions-count-container">
            <p class="questions-count">{tagCount}</p>
        </div>
    </div>
</Draggable>

<style>
    .container {
        display: flex;
        align-items: center;
        display: grid;
        grid-template-columns: auto 1fr auto;
        z-index: 100000;
    }

    .color {
        width: 11px;  
        aspect-ratio: 1;
        border-radius: 50%;
        background: white;
        margin-right: 20px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 1.5);
    }

    .questions-count-container {
        margin-right: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .questions-count {
        font-size: 17px;
        color: grey;
    }
</style>
