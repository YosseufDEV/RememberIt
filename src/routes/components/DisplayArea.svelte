<script lang="ts">  
import { invoke } from "@tauri-apps/api/core";

    import AddQuestionForm from "./AddQuestionForm.svelte";
    import Question from "./Question.svelte";
    import type { QuestionsCollection } from "../types"
    import { questions_collection } from "../selected-questions-store";
    import { getCollectionById, getQuestionsByCollectionId, insertQuestionByCollectionId } from "../../database";

    $: questionsCollection = { questions: [], id: -1, title: "UNTITLED" } as QuestionsCollection

    async function addQuestionToCurrentCollection(e: CustomEvent) {
        const question = e.detail;
        let notDuplicate = true;

        questionsCollection.questions.forEach((q) => {
            if(q.question_number == question.question_number) {
                notDuplicate = false;
            }
        })

        if(notDuplicate) {
            insertQuestionByCollectionId(question.question_number, questionsCollection.id)
            questionsCollection.questions = await getQuestionsByCollectionId(questionsCollection.id);
            console.log("updated");
        }

    }
    questions_collection.subscribe((collection) => questionsCollection = collection);

</script>

<div>
    {#if questions_collection}
        <h1>{questionsCollection.title}</h1>
    {/if}
    {#each questionsCollection.questions  as question (question.question_number)}
        <Question number={question.question_number} reasons={question.reason}/>
    {/each}
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
