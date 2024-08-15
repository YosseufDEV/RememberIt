<script>
    import Question from "./Question.svelte";

    export let parentCollection;
    console.log(parentCollection);
</script>

<div>
    <h1>{parentCollection.title}</h1>
    {#each parentCollection.child_collections  as collection (collection.id)}
        <h3>{collection.title}</h3>
        {#each collection.questions  as question (question.question_number)}
            <Question number={question.question_number} reasons={question.reasons}/>
        {/each}
    {/each}
    <!-- <AddQuestionForm on:addQuestion={addQuestionToCurrentCollection}/> -->
</div>
