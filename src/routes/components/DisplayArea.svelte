<script lang="ts">  
    import AddQuestionForm from "./Forms/AddQuestionForm.svelte";
    import ParentCollectionView from "./Views/DisplayArea/ParentCollectionView.svelte";
    import ChildCollectionView from "./Views/DisplayArea/ChildCollectionView.svelte";

    import type { QuestionsCollection, ParentCollection, Question } from "../typescript/types"
    import { getQuestionByQuestionNumber, getQuestionsByCollectionId, insertQuestionByCollectionId, insertQuestionReason } from "../../database";
    import { active_collection } from "../stores/active_collection_store";
    import { TEMP_DATABASE } from "../typescript/Database/TempDatabase";
    import { get } from "svelte/store";
    import DropZone from "./DragAndDrop/DropZone.svelte";

    $: activeCollection = { id: -1, title: "UNTITLED" } as ParentCollection | QuestionsCollection

    // TODO: Intorduce reactivity 
    async function addQuestionToCurrentCollection(e: CustomEvent) {
        if('parent_collection_id' in activeCollection) {
            const question = e.detail;

            let notDuplicate = true;

            activeCollection.questions.forEach((q: Question) => {
                if(q.question_number == question.question_number)
                    notDuplicate = false;
            })

            // TODO: Stack Reasons 
            // BUG: Would not work when not inside a collection!
            if(notDuplicate) {
                insertQuestionByCollectionId(question.question_number, activeCollection.id).then(async q => {
                    await insertQuestionReason(q.id, question.reason)
                })
            } else {
                const questionObj = await getQuestionByQuestionNumber(activeCollection.id, e.detail.question_number)
                await insertQuestionReason(questionObj.id, question.reason);
            }
            activeCollection.questions = await getQuestionsByCollectionId(activeCollection.id);
            let t = get(TEMP_DATABASE);
            t.questions.push(question);
            TEMP_DATABASE.set(t);
        }
    }

    function handleDraggableDrop() {
        console.log("dropped item");
    }

    active_collection.subscribe((collection) => activeCollection = collection);

</script>

<div class="main-container">
    <DropZone on:dropevent={handleDraggableDrop} >
        <div class="container">
            {#if 'parent_collection_id' in activeCollection}
                <ChildCollectionView childCollection={activeCollection} />
            {:else if activeCollection.id > 0}
                <ParentCollectionView parentCollection={activeCollection}/>
            {/if}
            <AddQuestionForm on:addQuestion={addQuestionToCurrentCollection}/>
        </div>
    </DropZone>
</div>

<style>
    /* TODO: Make the scrollbar interactive to clicking and dragging*/
    ::-webkit-scrollbar {
        width: 2px;
        padding: 5px;
        margin-right: 5px;
    }

    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0);
        margin-right: 5px;
    }

    ::-webkit-scrollbar-thumb {
        background: #9f9f9f;
        margin-right: 5px;
        border-radius: 500px;
    }

    .main-container {
        background: rgba(0, 0, 0, 0.7);
        width: 100%;
        padding-top: 50px;
        padding-bottom: 10px;
        padding-left: 25px;
    }
    .container {
        overflow-y: scroll;
        width: calc(100% - 7px);
        height: 100%;
    }
</style>
