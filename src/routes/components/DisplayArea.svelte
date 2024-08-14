<script lang="ts">  
    import { Reason } from "../types";
    import { questions_collection } from "../selected-questions-store";
    import { DATABASE, loadDatabase } from "../../database";
    import AddQuestionForm from "./AddQuestionForm.svelte";
    import Question from "./Question.svelte";
    import { invoke } from "@tauri-apps/api/core";

    $: questionsCollection = []

    async function get_first_collection() {
        questions_collection.set(await invoke("get_questions_by_collection_id", { id: 1 }))
    }

    // TODO: Update This Shit
    function deleteQuestionFromCurrentCollection(question_number: number) {
        const D_copy = DATABASE;
        const NEW_DATABASE = DATABASE[questionsCollection.id].questions.filter((q) => q.question_number != question_number) 
        D_copy[questionsCollection.id].questions = NEW_DATABASE;
        // updateDatabase(D_copy)
        questions_collection.set(D_copy[questionsCollection.id]);
    }

    async function addQuestionToCurrentCollection(e: CustomEvent) {
        const question = e.detail;
        await invoke("insert_question_by_collection_id", { questionNumber: question.question_number, collectionId: 0 })
    }

    questions_collection.subscribe((collection) => questionsCollection = collection);

</script>

<div>
    {#await loadDatabase()}
    {/await}
    {#if DATABASE.length > 0}
        <h1>{questionsCollection.title}</h1>
        {#each questionsCollection.questions  as question (question.question_number)}
        <Question number={question.question_number} reasons={question.reason}/>
        {/each}
    {/if}
    <p>{questionsCollection.id}</p>
    <AddQuestionForm on:addQuestion={addQuestionToCurrentCollection}/>
</div>

<style>
    div {
        margin-left: 25px;
        width: 100%;
        height: 100%;
    }
</style>
