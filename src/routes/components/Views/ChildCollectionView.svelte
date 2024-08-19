<script lang="ts">
    import Question from "../Question.svelte";
    import type { QuestionsCollection } from "../../typescript/types";

    export let childCollection: QuestionsCollection;
</script>

<div>
    <h3>{childCollection.title}</h3>
    {#if childCollection.questions.length > 0}
        {#each childCollection.questions  as question (question.question_number)}
            <Question number={question.question_number} reasons={question.reasons}/>
        {/each}
        {:else}
            <h4 style="color: white; font-weight: normal;">Nothing to show here</h4>
    {/if}
</div>
