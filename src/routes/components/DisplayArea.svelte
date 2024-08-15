<script lang="ts">  
    import ParentRender from "./ParentRender.svelte";
    import ChildCollectionRender from "./ChildCollectionRender.svelte";
    import AddQuestionForm from "./AddQuestionForm.svelte";

    import type { QuestionsCollection, ParentCollection, Question } from "../types"
    import { getQuestionsByCollectionId, insertQuestionByCollectionId } from "../../database";
    import { active_collection } from "../active_collection_store";


    $: activeCollection = { id: -1, title: "UNTITLED" } as ParentCollection | QuestionsCollection

    async function addQuestionToCurrentCollection(e: CustomEvent) {
        if('parent_collection_id' in activeCollection) {
            const question = e.detail;
            let notDuplicate = true;

            activeCollection.questions.forEach((q: Question) => {
                if(q.question_number == question.question_number) {
                    notDuplicate = false;
                }
            })

            // TODO: Add a nested reason to the "question" in question
            if(notDuplicate) {
                insertQuestionByCollectionId(question.question_number, activeCollection.id)
                activeCollection.questions = await getQuestionsByCollectionId(activeCollection.id);
                console.log("updated");
            }

        }
    }
    active_collection.subscribe((collection) => activeCollection = collection);

</script>

<div>
    {#if 'parent_collection_id' in activeCollection}
        <ChildCollectionRender childCollection={activeCollection} />
        {:else if activeCollection.id > 0}
        <ParentRender parentCollection={activeCollection}/>
    {/if}
    <AddQuestionForm on:addQuestion={addQuestionToCurrentCollection}/>
</div>

<style>
    div {
        margin-left: 25px;
        width: 100%;
        height: 100%;
    }
</style>
