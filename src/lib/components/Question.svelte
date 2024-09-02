<script lang="ts">
    import { onMount, tick } from "svelte";

    import type { Question } from "../typescript/types";
    import Badge from "./Badge.svelte";
    import EditableText from "$lib/GenericComponents/EditableText.svelte";
    import { updateQuestionNumberById } from "../../database";

    let questionRef: HTMLElement;
    let questionNumberRef: HTMLElement;
    let tag = 'p';

    export let question: Question;

    async function handleQuestionNumberEdit(e: CustomEvent) {
        const newQuestionNumer = e.detail.newText;
        console.log(typeof newQuestionNumer);
        await updateQuestionNumberById(question.id, Number(newQuestionNumer));
    }

    onMount(() => {
        // let tmp = get(TEMP_DATABASE);
        //
        // tmp.questions.forEach((tmp_question, i) => {
        //     if(tmp_question.question_number == question.question_number && tmp_question.collection_id == tmp_question.collection_id) {
        //         // INFO :Remove Question from temp!;
        //         newlyAddedQuestionAnimation(questionRef);
        //         tmp.questions = tmp.questions.filter((_, index) => index != i)  
        //     }
        // })
        //
        // TEMP_DATABASE.set(tmp);
    })

</script>

<div class="container" bind:this={questionRef}>
    <div class="number-container">
        <EditableText on:finishedEditing={handleQuestionNumberEdit} type="number" text={question.questionNumber.toString()} />
    </div>
    {#each question.tags as tag}
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
