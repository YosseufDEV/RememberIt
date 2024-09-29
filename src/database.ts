import { invoke } from "@tauri-apps/api/core";
import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";

import type { Collection, Question, QuestionsCollection, Tag, QuestionTag, QuestionSpecificTag, QuestionType } from "./lib/typescript/types";

export interface Database {
    parents: Collection[],
    unnested: Collection[],
    tags: Tag[],
    types: QuestionType[],
    questionCollections: QuestionsCollection[],
    questionTags: QuestionSpecificTag[],
}

export async function loadSQLITEDatabase(): Promise<Database> {
    const unnested = await getAllCollections(true);
    const parents = await getAllCollections();
    const tags = await getAllTags();
    const questionCollections = await getAllQuesitonsCollections();
    const types = await getAllQuestionTypes();
    const questionTags = await getAllQuestionsTags();

    return {
        parents,
        unnested,
        tags,
        questionTags,
        questionCollections,
        types
    }
}

async function importCollection(collection: Collection, 
                                tagArr: Tag[], 
                                typesArr: QuestionType[], 
                                parentId?: number) {
    let pId: number;

    await createCollection(collection.title, parentId).then(parent => {
        pId = parent.id;

        collection.questionsCollections.forEach((el) => {
            createQuestionsCollection(el.title, parent.id).then((col) => {
                el.questions.forEach((oldQ) => {
                    const type = oldQ.questionType;
                    let typeId: number = -1;
                    if(type) {
                        typeId = typesArr.find((el) => el.label == type.label && el.color == type.color)?.id!;
                    }
                    const qId = typeId != -1 ? typeId : typesArr[0].id;

                    insertQuestionByCollectionId(oldQ.questionNumber, col.id, qId).then((q) => {
                        oldQ.tags.forEach((tag) => {
                            const tagId = tagArr.find((el) => el.label == tag.label && el.color == tag.color)?.id!;
                            insertQuestionTag(q.id, tagId, tag.explanation);
                        })
                    })
                })
            })
        })

        collection.subCollections.forEach(async (el) => {
            await importCollection(el, tagArr, typesArr, pId)
        })
    })

}

export async function importFromJson(json: Database) {
    const updatedTags: Tag[] = [];
    const updatedTypes: Tag[] = [];

    json.tags.forEach(async (tag) => {
        updatedTags.push(await insertTag(tag.label, tag.color));
    })
    if(!json.types || json.types.length == 0) {
        updatedTypes.push(await insertQuestionType("Imported Type", "#000"));
    }

    if(json.types) {
        json.types.forEach(async (type) => {
            updatedTypes.push(await insertQuestionType(type.label, type.color));
        })
    }

    json.unnested.forEach(async (el) => {
        await importCollection(el, updatedTags, updatedTypes);
    })

}

// TODO: do this!
export async function exportDatabaseAsJSON() {
    const object = JSON.stringify(await loadSQLITEDatabase());
    writeTextFile('save.json', object, {
        baseDir: BaseDirectory.Desktop
    }) 
}

export async function getAllCollections(unnested?: boolean): Promise<Collection[]> {
    if(unnested) {
        return await invoke("get_all_super_collections");
    } else {
        return await invoke("get_all_collections");
    }
}

export async function getCollectionsByParentId(id: number): Promise<QuestionsCollection[]> {
    return await invoke("get_collections_by_parent_id", { parId: id })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
}

export async function createQuestionsCollection(title: string, parentId: number): Promise<QuestionsCollection> {
    return await invoke("create_questions_collection", { title, parentId })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
}

export async function deleteCollectionById(colId: number) {
    await invoke("delete_collection_by_id", { colId });
}

export async function deleteQuestionsCollectionById(colId: number) {
    await invoke("delete_questions_collection_by_id", { colId });
}

export async function getQuestionsCollecitonById(id: number): Promise<Collection> {
    return await invoke("get_questions_collection_by_id", { pId: id  })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
}

export async function updateQuestionsCollectionTitleById(id: number, newTitle: String) {
    await invoke("update_question_collection_title_by_id", { collectionId: id, newTitle})
}

export async function updateQuestionNumberById(id: number, newQuestionNumber: number) {
    await invoke("update_question_number_by_id", { questionId: id, newQuestionNumber})
}

export async function deleteQuestionById(id: number) {
    await invoke("delete_question_by_id", { questionId: id })
}

export async function createCollection(title: string, parentId?: number): Promise<Collection> {
    return await invoke("create_collection", { title, parentId });
}

export async function getCollectionById(pId: number): Promise<QuestionsCollection> {
    return await invoke("get_collection_by_id", { pId })
}

export async function updatesCollectionTitleById(id: number, newTitle: String) {
    await invoke("update_collection_title_by_id", { collectionId: id, newTitle})
}

export async function getAllQuesitonsCollections(): Promise<QuestionsCollection[]> {
    return await invoke("get_all_questions_collections")
}

export async function insertQuestionByCollectionId(questionNumber: number, id: number, questionType: number): Promise<Question> {
    return await invoke("insert_question_by_collection_id", { questionNumber, collectionId: id, questionType });
}

export async function getQuestionsByCollectionId(id: number): Promise<Question[]> {
     return await invoke("get_questions_by_collection_id", { colId: id });
}

export async function getQuestionByQuestionNumber(id: number, questionNumber: number): Promise<Question> {
     return await invoke("get_question_by_question_number", { colId: id, questionNumber});
}

export async function updateQuestionTypeById(questionId: number, newTypeId: number): Promise<Question> {
     return await invoke("update_question_type_by_id", { questionId, newTypeId});
}

export async function getUntitledCount(): Promise<number> {
    return await invoke("get_untitled_count")
}

export async function insertTag(label: string, color: string): Promise<Tag> {
    return await invoke("insert_tag", { label, color })
}

export async function getTagById(id: number): Promise<Tag> {
    return await invoke("get_tag_by_id", { tagId: id})
}

export async function getAllTags(): Promise<Tag[]> {
    return await invoke("get_tags")
}

export async function updateTagLabelById(tagId: number, newLabel: string): Promise<Tag[]> {
    return await invoke("update_tag_label_by_id", { tagId, newLabel })
}

export async function updateTypeLabelById(typeId: number, newLabel: string): Promise<QuestionType[]> {
    return await invoke("update_type_label_by_id", { typeId, newLabel })
}

export async function updateTagColorById(tagId: number, newColor: string): Promise<Tag[]> {
    return await invoke("update_tag_color_by_id", { tagId, newColor })
}

export async function insertQuestionTag(questionId: number, tagId: number, explanation: string): Promise<QuestionTag> {
    return await invoke("insert_question_tag", { questionId, tagId, explanation })
}

export async function getQuestionTagsById(questionId: number): Promise<string[]> {
    return await invoke("get_question_tags_by_id", { questionId })
}

export async function updateQuestionTagExplanationById(id: number, newExplanation: String) {
    await invoke("update_question_tag_explanation_by_id", { questionTagId: id, newExplanation })
}

export async function deleteQuestionTagById(questionTagId: number) {
    await invoke("delete_question_tag_by_id", { questionTagId });
}

export async function insertQuestionType(label: string, color: string): Promise<QuestionType> {
    return await invoke("insert_question_type", { label, color });
}

export async function updateTypeColorById(questionTypeId: number, newColor: string): Promise<QuestionType> {
    return await invoke("update_type_color_by_id", { questionTypeId, newColor });
}

export async function getAllQuestionTypes(): Promise<QuestionType[]> {
    return await invoke("get_all_question_types");
}

export async function getAllQuestionsTags(): Promise<QuestionSpecificTag[]> {
    return await invoke("get_all_questions_tags");
}
