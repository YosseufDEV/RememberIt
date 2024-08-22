<script lang="ts">
    import { get } from "svelte/store";
    import { onMount } from "svelte";

    import type { Question } from "../typescript/types";
    import { TEMP_DATABASE } from "../typescript/Database/TempDatabase";
    import Badge from "./Badge.svelte";
    import { newlyAddedQuestionAnimation } from "./Animations/QuestionLifecylceAnimations";

    let questionRef: HTMLElement;

    export let question: Question;

    onMount(() => {
        let tmp = get(TEMP_DATABASE);

        tmp.questions.forEach((tmp_question, i) => {
            if(tmp_question.question_number == question.question_number && tmp_question.collection_id == tmp_question.collection_id) {
                // INFO :Remove Question from temp!;
                newlyAddedQuestionAnimation(questionRef);
                tmp.questions = tmp.questions.filter((_, index) => index != i)  
            }
        })

        TEMP_DATABASE.set(tmp);
    })
</script>

<div class="container" bind:this={questionRef}>
    <div class="number-container">
        <p>{question.question_number}</p>
    </div>
    {#each question.reasons as reason}
        <Badge reason={reason}/>
    {/each}
</div>

<style>
    .container {
        width: fit-content;
        background: rgba(125, 125, 125, 0.5);
        display: flex;
        padding: 5px;
        margin: 15px 0px;
        border-radius: 15px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
        overflow: hidden;
    }
    .number-container {
        color: white;
        border-radius: 10px;
        border-top-right-radius: 0px;
        border-bottom: 0px;
        padding: 2px;
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
