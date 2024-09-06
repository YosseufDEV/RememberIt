<script lang="ts">
    import { onMount, tick } from "svelte";

    import type { Question } from "../typescript/types";
    import Badge from "./Badge.svelte";
    import EditableText from "$lib/GenericComponents/EditableText.svelte";
    import { updateQuestionNumberById } from "../../database";
    import { QUESTION_TAGS_COLLECTION_SLICE_DATABASE } from "$lib/typescript/Database/CachedDatabase";
    import DropZone from "./DragAndDrop/DropZone.svelte";

    let questionRef: HTMLElement;

    export let question: Question;

    $: questionsTags = question.tags;

    async function handleQuestionNumberEdit(e: CustomEvent) {
        const newQuestionNumer = e.detail.newText;
        console.log(typeof newQuestionNumer);
        await updateQuestionNumberById(question.id, Number(newQuestionNumer));
    }

    onMount(() => {
        QUESTION_TAGS_COLLECTION_SLICE_DATABASE.subscribe((col) => {
            let specificTags = col.filter((q) => q.questionId == question.id);
            if(specificTags.length != questionsTags.length) {
                questionsTags = specificTags;
            }
        })
    })

</script>

<div class="container" bind:this={questionRef}>
    <div class="number-container">
        <EditableText on:finishedEditing={handleQuestionNumberEdit} type="number" text={question.questionNumber.toString()} />
    </div>
    {#each questionsTags as tag}
        <Badge questionId={question.id} tag={tag}/>
    {/each}
</div>

<style>
    p:focus {
        align-items: center;
        justify-content: center;
        border: none;
        outline: none;
    }

    .container {
        height: 33px;
        width: fit-content;
        background: rgba(125, 125, 125, 0.5);
        display: flex;
        padding: 5px;
        margin: 15px 0px;
        border-radius: 12px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    }

    .number-container {
        overflow: hidden;
        color: white;
        border-radius: 10px;
        border-top-right-radius: 0px;
        padding: 3px;
        width: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: -5px -5px;
        margin-right: 10px;
        background: #9E2449;
        font-weight: 500;
    }
</style>
