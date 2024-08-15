<script lang="ts">
    import Question from "./Question.svelte";
    import type { QuestionsCollection } from "../types";

    export let childCollection: QuestionsCollection;
    console.log(childCollection);
</script>

<div>
    <h1>{childCollection.title}</h1>
    {#each childCollection.questions  as question (question.question_number)}
        <Question number={question.question_number} reasons={question.reason}/>
    {/each}
</div>
