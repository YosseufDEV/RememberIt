import { invoke } from "@tauri-apps/api/core";

import type { Collection, Question, QuestionsCollection, Tag, QuestionTag } from "./lib/typescript/types";

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

export async function getQuestionsCollecitonById(id: number): Promise<Collection> {
    return await invoke("get_questions_collection_by_id", { pId: id  })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
}

export async function updateQuestionsCollectionTitleById(id: number, newTitle: String) {
    await invoke("update_question_collection_title_by_id", { collectionId: id, newTitle})
}

export async function updateQuestionNumberById(id: number, newQuestionNumber: number) {
    await invoke("update_question_number_by_id", { questionId: id, newQuestionNumber})
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

export async function insertQuestionByCollectionId(questionNumber: number, id: number): Promise<Question> {
    return await invoke("insert_question_by_collection_id", { questionNumber, collectionId: id });
}

export async function getQuestionsByCollectionId(id: number): Promise<Question[]> {
     return await invoke("get_questions_by_collection_id", { colId: id });
}

export async function getQuestionByQuestionNumber(id: number, questionNumber: number): Promise<Question> {
     return await invoke("get_question_by_question_number", { colId: id, questionNumber});
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

export async function insertQuestionTag(questionId: number, tagId: number, explanation: string): Promise<QuestionTag> {
    return await invoke("insert_question_tag", { questionId, tagId, explanation })
}

export async function getQuestionTagsById(questionId: number): Promise<string[]> {
    return await invoke("get_question_tags_by_id", { questionId })
}

export async function updateQuestionTagExplanationByBothIds(sQuestionId: number, sTagId: number, newExplanation: String) {
    await invoke("update_question_tag_explanation_by_both_ids", { sQuestionId, sTagId, newExplanation })
}
