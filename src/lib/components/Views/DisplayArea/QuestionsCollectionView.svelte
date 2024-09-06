<script lang="ts">
    import type { QuestionsCollection } from "../../../typescript/types";
    import { QUESTION_COLLECTION_SLICE_DATABASE } from "../../../typescript/Database/CachedDatabase";
    import Question from "../../Question.svelte";

    export let questionsCollection: QuestionsCollection, nestedRendering=false;

    $: reativeQuestionsCollection = questionsCollection;

    QUESTION_COLLECTION_SLICE_DATABASE.subscribe((col) => {
        let collectionObjectInDB = col.filter((c) => c.id == questionsCollection.id)[0];
        reativeQuestionsCollection = collectionObjectInDB
    })

</script>

<div>
    {#if nestedRendering}
        <h3>{questionsCollection.title}</h3>
    {/if}
    {#if reativeQuestionsCollection.questions.length > 0}
        {#each reativeQuestionsCollection.questions  as question (question.id)}
            <Question question={question}/>
        {/each}

        {:else}
            <h4 class="collection-empty-text">لا يوجد اسئلة لعرضها</h4>
    {/if}
</div>

<style>
    .collection-empty-text {
        color: white; 
        margin-bottom: 30px;
        margin-top: 10px;
    }
</style>
