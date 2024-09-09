<script lang="ts">
    import { onMount } from "svelte";
    import { Menu, MenuItem } from "@tauri-apps/api/menu"

    import type { Question } from "../typescript/types";
    import { deleteQuestionById, updateQuestionNumberById } from "../../database";
    import { QUESTION_TAGS_COLLECTION_SLICE_DATABASE } from "$lib/typescript/Database/CachedDatabase";
    import { deleteQuestionAnimation } from "./Animations/QuestionLifecylceAnimations";

    import Badge from "./Badge.svelte";
    import EditableText from "$lib/GenericComponents/EditableText.svelte";

    export let question: Question;
    let questionRef: HTMLElement;
    let menu: Menu;

    $: questionsTags = question.tags;

    async function handleQuestionNumberEdit(e: CustomEvent) {
        const newQuestionNumer = e.detail.newText;
        await updateQuestionNumberById(question.id, Number(newQuestionNumer));
    }

    async function showMenu() {
        await menu.popup();
    }

    function deleteQuestion() {
        deleteQuestionAnimation(questionRef).then(async () => {
            await deleteQuestionById(question.id);
        })
    }
    
    onMount(async () => {
        QUESTION_TAGS_COLLECTION_SLICE_DATABASE.subscribe((col) => {
            let specificTags = col.filter((q) => q.questionId == question.id);
            if(specificTags.length != questionsTags.length) {
                questionsTags = specificTags;
            }
        })

        const menuItems = await Promise.all([
            MenuItem.new({
                text: 'Delete Question',
                action: deleteQuestion,
            }),
        ])

        menu = await Menu.new({
            items: menuItems
        })
    })

</script>

<div class="container" bind:this={questionRef} on:contextmenu={showMenu} >
    <div class="number-container">
        <EditableText on:finishedEditing={handleQuestionNumberEdit} type="number" text={question.questionNumber.toString()} />
    </div>
    {#each questionsTags as tag}
        <Badge questionId={question.id} tag={tag}/>
    {/each}
</div>

<style>
    p:focus {
        align-items: center;
        justify-content: center;
        border: none;
        outline: none;
    }

    .container {
        height: 33px;
        width: fit-content;
        background: rgba(125, 125, 125, 0.5);
        display: flex;
        padding: 5px;
        margin: 15px 0px;
        border-radius: 12px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    }

    .number-container {
        overflow: hidden;
        color: white;
        border-radius: 10px;
        border-top-right-radius: 0px;
        padding: 3px;
        width: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: -5px -5px;
        margin-right: 10px;
        background: #9E2449;
        font-weight: 500;
    }
</style>
