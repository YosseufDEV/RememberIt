<script lang="ts">
    import { QUESTION_COLLECTION_SLICE_DATABASE } from "../../../typescript/Database/CachedDatabase";
    import type { QuestionsCollection } from "../../../typescript/types";
    import { active_collection } from "../../../stores/active_collection_store";
    import Question from "../../Question.svelte";

    export let childCollection: QuestionsCollection, nestedRendering=false;

    console.log({childCollection})
    $: childCollection = childCollection;

    QUESTION_COLLECTION_SLICE_DATABASE.subscribe((col) => {
        let collectionObjectInDB = col.filter((c) => c.id == childCollection.id)[0];

        if(collectionObjectInDB.questions.length != childCollection.questions.length) {
            childCollection = collectionObjectInDB;
            active_collection.set(childCollection);
        }
    })

</script>

<div>
    {#if nestedRendering}
        <h2>{childCollection.title}</h2>
        {:else}
            <h1>{childCollection.title}</h1>
    {/if}
    {#if childCollection.questions.length > 0}
        {#each childCollection.questions  as question (question.id)}
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
