<script lang="ts">
    import { onMount } from "svelte";
    import { Menu, MenuItem, Submenu } from "@tauri-apps/api/menu"

    import type { Question } from "../typescript/types";
    import { deleteQuestionById, updateQuestionNumberById, updateQuestionTypeById } from "../../database";
    import { QUESTION_TAGS_COLLECTION_SLICE_DATABASE, QUESTION_TYPES_SLICE_DATABASE } from "$lib/typescript/Database/CachedDatabase";
    import { deleteQuestionAnimation } from "./Animations/QuestionLifecylceAnimations";

    import Badge from "./Badge.svelte";
    import EditableText from "$lib/GenericComponents/EditableText.svelte";
    import { get } from "svelte/store";
    import { Tooltip } from "fluent-svelte";

    export let question: Question;
    let questionRef: HTMLElement;
    let questionTypes = get(QUESTION_TYPES_SLICE_DATABASE);

    $: questionsTags = question.tags;

    async function handleQuestionNumberEdit(e: CustomEvent) {
        const newQuestionNumer = e.detail.newText;
        await updateQuestionNumberById(question.id, Number(newQuestionNumer));
    }

    async function showMenu() {
        console.log("Zinkp");

        const typesSubmenuItems = questionTypes.map(el => (
            MenuItem.new({
                text: el.label,
                action: () => changeTypeTo(el.id)
            })
        ))

        const menuItems = await Promise.all([
            Submenu.new({
                text: "Change Type",
                items: await Promise.all(typesSubmenuItems)
            }),
            MenuItem.new({
                text: 'Delete Question',
                action: deleteQuestion,
            }),
        ])


        const menu = await Menu.new({
            items: menuItems
        })
        console.log(menu);

        await menu.popup();
    }

    function deleteQuestion() {
        deleteQuestionAnimation(questionRef).then(async () => {
            await deleteQuestionById(question.id);
        })
    }

    async function changeTypeTo(id: number) {
        await updateQuestionTypeById(question.id, id);
        question.questionType = questionTypes.find((el) => el.id == id)!;
    }
    
    onMount(async () => {
        // INFO: Watch For tags changes!
        QUESTION_TAGS_COLLECTION_SLICE_DATABASE.subscribe((col) => {
            let specificTags = col.filter((q) => q.questionId == question.id);
            if(specificTags.length != questionsTags.length) {
                questionsTags = specificTags;
            }
        })
 
    })
</script>

<Tooltip text={question.questionType.label}>
    <div class="container" bind:this={questionRef} on:contextmenu={showMenu} >
        <div style:background={`${question.questionType.color}`} class="number-container">
            <EditableText on:finishedEditing={handleQuestionNumberEdit} type="number" text={question.questionNumber.toString()} />
        </div>
        {#each questionsTags as tag}
            <Badge questionId={question.id} tag={tag}/>
        {/each}
    </div>
</Tooltip>

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
        font-weight: 500;
    }
</style>
