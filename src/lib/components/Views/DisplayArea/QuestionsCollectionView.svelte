<script lang="ts">
    import type { QuestionsCollection } from "../../../typescript/types";
    import { QUESTION_COLLECTION_SLICE_DATABASE } from "../../../typescript/Database/CachedDatabase";
    import Question from "../../Question.svelte";

    export let questionsCollection: QuestionsCollection, nestedRendering=false;
    console.log(questionsCollection);

    $: reativeQuestionsCollection = questionsCollection;

    QUESTION_COLLECTION_SLICE_DATABASE.subscribe((col) => {
        let collectionObjectInDB = col.filter((c) => c.id == questionsCollection.id)[0];

        console.log("NO!!!!");
        reativeQuestionsCollection = collectionObjectInDB
        // if(collectionObjectInDB.questions.length != questionsCollection.questions.length) {
        //     console.log("OK!!!!");
        //     reativeQuestionsCollection = collectionObjectInDB;
        //     reativeQuestionsCollection.questions = collectionObjectInDB.questions
        // }
    })

</script>

<div>
    {#if nestedRendering}
        <h2>{questionsCollection.title}</h2>
    {/if}
    {#if reativeQuestionsCollection.questions.length > 0}
        {#each reativeQuestionsCollection.questions  as question (question.id)}
            <Question question={question}/>
        {/each}

        {:else}
            <h4 class="collection-empty-text">Nothing to show here</h4>
    {/if}
</div>

<style>
    .collection-empty-text {
        color: white; 
        font-weight: 400;
    }
</style>
