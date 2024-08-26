<script lang="ts">
    import { get } from "svelte/store";

    import { type Question } from "../../typescript/types";
    import { ComboBox, Button, TextBox, Tooltip } from "fluent-svelte";
    import { DATABASE, QUESTION_COLLECTION_SLICE_DATABASE, TAGS_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";
    import { createEventDispatcher } from "svelte";
    import { active_collection } from "../../stores/active_collection_store";
    import { getQuestionByQuestionNumber, getQuestionsByCollectionId, getReasonById, insertQuestionByCollectionId, insertQuestionReason } from "../../../database";

    const dispatch = createEventDispatcher();
    const activeCollection = get(active_collection);

    let reasons: { name: string, value: number }[] = [];
    let questionNumber: number;
    let reasonId: number = 1;

    async function addQuestionToCurrentCollection() {
        if('parent_collection_id' in activeCollection) {
            let notDuplicate = true;

            activeCollection.questions.forEach((q: Question) => {
                if(q.question_number == questionNumber)
                    notDuplicate = false;
            })

            // TODO: Stack Reasons 
            if(notDuplicate) {
                insertQuestionByCollectionId(questionNumber, activeCollection.id).then(async q => {
                    await insertQuestionReason(q.id, reasonId)

                    let tag = get(TAGS_SLICE_DATABASE).filter((t) => t.id == reasonId)[0]
                    let completeQuestion = {
                        id: q.id,
                        question_number: q.question_number,
                        collection_id: q.collection_id,
                        reasons: [tag]
                    }

                    console.log({completeQuestion})

                    let oldDB = get(QUESTION_COLLECTION_SLICE_DATABASE);

                    // BUG: Would throw an error when not inside a collection!
                    oldDB = oldDB.map((col) => {
                        if(col.id == activeCollection.id) {
                            col.questions.push(completeQuestion);
                        }
                        return col;
                    })
                    console.log(oldDB);
                    QUESTION_COLLECTION_SLICE_DATABASE.set(oldDB);
                })
            } else {
                const question = await getQuestionByQuestionNumber(activeCollection.id, questionNumber)
                await insertQuestionReason(question.id, reasonId);
            }
            // INFO: For Question appear animation
            // let t = get(TEMP_DATABASE);
            // t.questions.push(question);
            // TEMP_DATABASE.set(t);
        }
    }

    function handleSubmit() {
        addQuestionToCurrentCollection();
    }

    DATABASE.subscribe((db) => {
        reasons = db.tags.map((el) => (
            {
                value: el.id,
                name: el.label,
            }
        ));
    })
</script>

<form on:submit|preventDefault={handleSubmit}>
    <TextBox class="text-box" placeholder="Question Number" bind:value={questionNumber} type="number"/>
    <ComboBox bind:value={reasonId} class="combo-box" items={reasons}/>
    <Button variant="accent">Add</Button>
</form>
