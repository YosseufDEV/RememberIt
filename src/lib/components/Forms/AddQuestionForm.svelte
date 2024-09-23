<script lang="ts">
    import { get } from "svelte/store";

    import { DATABASE, QUESTION_COLLECTION_SLICE_DATABASE, QUESTION_TAGS_COLLECTION_SLICE_DATABASE, QUESTION_TYPES_SLICE_DATABASE, TAGS_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";
    import { type Collection, type Question, type QuestionsCollection, type QuestionSpecificTag, type Tag } from "../../typescript/types";
    import { active_collection } from "../../stores/active_collection_store";
    import { getQuestionByQuestionNumber, insertQuestionByCollectionId, insertQuestionTag } from "../../../database";
    import { ComboBox, Button, TextBox } from "fluent-svelte";

    const activeCollection: QuestionsCollection | Collection = get(active_collection);

    let tags: Tag[] = get(TAGS_SLICE_DATABASE);
    let types: Tag[] = get(QUESTION_TYPES_SLICE_DATABASE);

    let questionNumber: number,
        explanation: string,
        tagId: number = 1,
        typeId: number = 1;

    async function addQuestionToCurrentCollection() {
        if(!('questions' in activeCollection)) return;

        let notDuplicate = true;

        activeCollection.questions.forEach((q: Question) => {
            if(q.questionNumber == questionNumber && q.questionType.id == typeId) {
                notDuplicate = false;
            }
        })

        if(notDuplicate) {
            console.log("Not!");
            insertQuestionByCollectionId(questionNumber, activeCollection.id, typeId).then(async q => {
                await insertQuestionTag(q.id, tagId, explanation).then((qt) => {
                    let tag = get(TAGS_SLICE_DATABASE).filter((t) => t.id == tagId)[0]

                    let specificTag: QuestionSpecificTag = {
                        id: tag.id,
                        questionId: qt.question_id,
                        questionTagId: qt.id,
                        color: tag.color,
                        label: tag.label,
                        explanation: qt.explanation,
                    };

                    let completeQuestion = {
                        id: q.id,
                        questionNumber: q.questionNumber,
                        questionType: q.questionType,
                        collectionId: q.collectionId,
                        tags: [ specificTag ],
                    }

                    let oldDB = get(DATABASE);
                    let oldActiveCollection = activeCollection;

                    oldDB.questionTags.push(specificTag);
                    oldActiveCollection.questions.push(completeQuestion);

                    oldDB.questionCollections = oldDB.questionCollections.map((col) => {
                        if(col.id == activeCollection.id) {
                            col.questions.push(completeQuestion);
                        }
                        return col;
                    })

                    if('subCollections' in activeCollection) {
                        active_collection.set(oldDB.parents.find((p) => p.id==activeCollection.id));
                    } else {
                        active_collection.set(oldDB.questionCollections.find((p) => p.id==activeCollection.id));
                    }

                })
            })
        } else {
            const question = await getQuestionByQuestionNumber(activeCollection.id, questionNumber)
            const qt = await insertQuestionTag(question.id, tagId, explanation);

            let tag = get(TAGS_SLICE_DATABASE).filter((t) => t.id == tagId)[0]

            let specificTag: QuestionSpecificTag = {
                id: tag.id,
                questionId: question.id,
                questionTagId: qt.id,
                color: tag.color,
                label: tag.label,
                explanation: qt.explanation
            };

            let oldDB = get(DATABASE);

            oldDB.questionTags.push(specificTag);
            DATABASE.set(oldDB);
        }
    }

    function handleSubmit() {
        addQuestionToCurrentCollection();
    }

    TAGS_SLICE_DATABASE.subscribe((db) => {
        tags = db;
    })

    QUESTION_TYPES_SLICE_DATABASE.subscribe((db) => {
        types = db;
    })
</script>

<form on:submit|preventDefault={handleSubmit}>
    <div>
        <TextBox class="text-box" placeholder="Question Number" bind:value={questionNumber} type="number"/>
        <TextBox class="text-box" placeholder="Explanation" bind:value={explanation} type="text"/>
    </div>
    <div>
        <ComboBox bind:value={tagId} class="combo-box" items={ tags.map((el) => ({ value: el.id, name: el.label }) ) }/>
        <ComboBox bind:value={typeId} class="combo-box" items={types.map((el) => ({ value: el.id, name: el.label }) )}/>
        <Button variant="accent">Add</Button>
    </div>
</form>

<style>
</style>
