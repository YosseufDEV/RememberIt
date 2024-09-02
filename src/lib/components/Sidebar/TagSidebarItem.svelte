<script lang="ts">
    import { get } from "svelte/store";
    import { onMount } from "svelte";

    import { DraggableItemType, type QuestionsCollection, type Tag, type TagItemMetadata } from "../../typescript/types";
    import { QUESTION_COLLECTION_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";
    import { mutateTagToBadgeAnimation } from "../Animations/TagItemAnimations";
    import Draggable from "../DragAndDrop/Draggable.svelte";
    import EditableText from "$lib/GenericComponents/EditableText.svelte";
    import Layout from "../../../routes/+layout.svelte";
    import { updateTagLabelById } from "../../../database";
    
    export let tag: Tag;

    let tagContainerRef: HTMLElement;
    let tagCircleRef: HTMLElement;
    let tagQuestionsCountRef: HTMLElement;
    let isDragged = false;
    let tagMetaData: TagItemMetadata = { 
                                    type: DraggableItemType.TAG, 
                                    id: tag.id,
                                    color: tag.color,
                                    label: tag.label,        
                                }

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
            mutateAnimation = mutateTagToBadgeAnimation(tagContainerRef, tagCircleRef, tagQuestionsCountRef);
        }
    }

    function handleDragStop() {
        if(mutateAnimation) {
            mutateAnimation.reverse().then(() => mutateAnimation = null);
        }
    }

    async function handleLabelChange(e: CustomEvent) {
        const newLabel = e.detail.newText; 
        console.log(newLabel);
        await updateTagLabelById(tag.id, newLabel);
    }

    onMount(() => {
        tagCount = getQuestionsWithTagCount();
        QUESTION_COLLECTION_SLICE_DATABASE.subscribe((_) => {
            tagCount = getQuestionsWithTagCount();
        })
    })
</script>

<Draggable bind:draggableItemMetadata={tagMetaData}
           draggableRef={tagContainerRef}
           on:dragstart={handleDragStart} 
           on:dragmove={handleDragMove} 
           on:dragdrop={handleDragStop}>
    <div class="container" bind:this={tagContainerRef}>
        <div class="color" style={`background: ${tag.color}`} bind:this={tagCircleRef}/>
        <EditableText on:finishedEditing={handleLabelChange} text={tag.label} />
        <!-- TODO : Hide this when dragging-->
        <div class="questions-count-container" bind:this={tagQuestionsCountRef}>
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
        z-index: 11;
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
