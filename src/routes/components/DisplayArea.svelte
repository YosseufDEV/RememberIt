<script lang="ts">  
    import AddQuestionForm from "./Forms/AddQuestionForm.svelte";
    import ParentCollectionView from "./Views/ParentCollectionView.svelte";
    import ChildCollectionView from "./Views/ChildCollectionView.svelte";

    import type { QuestionsCollection, ParentCollection, Question } from "../types"
    import { getQuestionByQuestionNumber, getQuestionsByCollectionId, insertQuestionByCollectionId, insertQuestionReason } from "../../database";
    import { active_collection } from "../active_collection_store";
    import Page from "../+page.svelte";


    $: activeCollection = { id: -1, title: "UNTITLED" } as ParentCollection | QuestionsCollection

    async function addQuestionToCurrentCollection(e: CustomEvent) {
        if('parent_collection_id' in activeCollection) {
            type SumbitedQuestion = {
                id: number,
                question_number: number,
                reason: number,
            }
                
            const question: SumbitedQuestion = e.detail;
            let notDuplicate = true;

            activeCollection.questions.forEach((q: Question) => {
                if(q.question_number == question.question_number) {
                    notDuplicate = false;
                }
            })

            // TODO: Add a nested reason to the "question" in question
            // BUG: Would not work when not inside a collection!
            if(notDuplicate) {
                insertQuestionByCollectionId(question.question_number, activeCollection.id).then(async q => {
                    await insertQuestionReason(q.id, question.reason)
                })
                activeCollection.questions = await getQuestionsByCollectionId(activeCollection.id);
            } else {
                const questionObj = await getQuestionByQuestionNumber(activeCollection.id, e.detail.question_number)
                console.log(questionObj);
                console.log(await insertQuestionReason(questionObj.id, question.reason));
            }
        }
    }

    active_collection.subscribe((collection) => 
    {
        activeCollection = collection;
        console.log(collection);
    });

</script>

<div>
    {#if 'parent_collection_id' in activeCollection}
        <ChildCollectionView childCollection={activeCollection} />
        {:else if activeCollection.id > 0}
        <ParentCollectionView parentCollection={activeCollection}/>
    {/if}
    <AddQuestionForm on:addQuestion={addQuestionToCurrentCollection}/>
</div>

<style>
    div {
        padding: 0px 25px;
        background: rgba(0, 0, 0, 0.8);
        width: 100%;
        height: 100%;
    }
</style>
