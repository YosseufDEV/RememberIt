<script lang="ts">
    import { get } from "svelte/store";

    import { type Question, type QuestionSpecificTag } from "../../typescript/types";
    import { ComboBox, Button, TextBox } from "fluent-svelte";
    import { DATABASE, QUESTION_COLLECTION_SLICE_DATABASE, TAGS_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";
    import { active_collection } from "../../stores/active_collection_store";
    import { getQuestionByQuestionNumber, insertQuestionByCollectionId, insertQuestionTag } from "../../../database";

    const activeCollection = get(active_collection);

    let tags: { name: string, value: number }[] = [];
    let questionNumber: number,
        explanation: string,
        tagId: number = 1;

    async function addQuestionToCurrentCollection() {
        if('questions' in activeCollection) {
            let notDuplicate = true;

            activeCollection.questions.forEach((q: Question) => {
                if(q.questionNumber == questionNumber) {
                    notDuplicate = false;
                }
            })

            if(notDuplicate) {
                insertQuestionByCollectionId(questionNumber, activeCollection.id).then(async q => {
                    await insertQuestionTag(q.id, tagId, explanation).then((qt) => {
                        let tag = get(TAGS_SLICE_DATABASE).filter((t) => t.id == tagId)[0]

                        let specificTag: QuestionSpecificTag = {
                            id: tag.id,
                            color: tag.color,
                            label: tag.label,
                            explanation: qt.explanation
                        };

                        let completeQuestion = {
                            id: q.id,
                            questionNumber: q.questionNumber,
                            collectionId: q.collectionId,
                            tags: [specificTag]
                        }

                        let oldDB = get(QUESTION_COLLECTION_SLICE_DATABASE);

                        // BUG: Would throw an error when not inside a collection!
                        oldDB = oldDB.map((col) => {
                            if(col.id == activeCollection.id) {
                                col.questions.push(completeQuestion);
                            }
                            return col;
                        })
                        QUESTION_COLLECTION_SLICE_DATABASE.set(oldDB);
                    })
                })
            } else {
                const question = await getQuestionByQuestionNumber(activeCollection.id, questionNumber)
                await insertQuestionTag(question.id, tagId, explanation);
            }
            // INFO: For Question appear animation
            // let t = get(TEMPDATABASE);
            // t.questions.push(question);
            // TEMPDATABASE.set(t);
        }
    }

    function handleSubmit() {
        addQuestionToCurrentCollection();
    }

    DATABASE.subscribe((db) => {
        tags = db.tags.map((el) => (
            {
                value: el.id,
                name: el.label,
            }
        ));
    })
</script>

<form on:submit|preventDefault={handleSubmit}>
    <div>
        <TextBox class="text-box" placeholder="Question Number" bind:value={questionNumber} type="number"/>
        <TextBox class="text-box" placeholder="Explanation" bind:value={explanation} type="text"/>
    </div>
    <div>
        <ComboBox bind:value={tagId} class="combo-box" items={tags}/>
        <Button variant="accent">Add</Button>
    </div>
</form>

<style>
</style>
