<script lang="ts">
    import { tick } from "svelte";

    import type { QuestionSpecificTag } from "../typescript/types";
    import { badgeTapAnimation, badgeTapOutAnimation, darkenBadgeGradient, explanationAppearAnimation, explanationDisappearAnimation, removeBadgeAnimation, shakeBadge } from "./Animations/BadgeAnimations";
    import { adjustColor } from "$lib/typescript/color_generator";
    import EditableText from "$lib/GenericComponents/EditableText.svelte";
    import { deleteQuestionTagById, updateQuestionTagExplanationById } from "../../database";
    import BadgeOption from "./BadgeOption.svelte";

    export let tag: QuestionSpecificTag, questionId: number;
    let badgeRef: HTMLElement, 
        strikeThroughRef: HTMLElement,
        explanationRef: HTMLElement,
        badgeLabelRef: HTMLElement;
    $: isVisible = false;
    let hovered = false;
    let hoverLock = false;
    let gradientAnimationTimeline: GSAPTimeline;

    async function handleDoubleClick(e: MouseEvent) {
        if(e.target != badgeRef && e.target != badgeLabelRef && e.target != strikeThroughRef) return;
        if(!isVisible) {
            if(tag.explanation.length > 0) {
                gradientAnimationTimeline = darkenBadgeGradient(badgeRef, tag.color);
                isVisible = true;
                hoverLock = true;
                hovered = false;
                badgeTapAnimation(badgeRef);
                await tick();
                explanationAppearAnimation(explanationRef);
            } else {
                shakeBadge(badgeRef); 
            }
        } else {
            await tick();
            badgeTapOutAnimation(badgeRef);
            if(gradientAnimationTimeline) 
                gradientAnimationTimeline.revert();

            explanationDisappearAnimation(explanationRef).then(() => {
                isVisible = false;
                hoverLock = false;
            });
        }
    }

    async function handleExplanationEdit(e: CustomEvent) {
        const newExplanation = e.detail.newText;

        await updateQuestionTagExplanationById(tag.questionTagId, newExplanation);
        tag.explanation = newExplanation;
    }

    function handleBadgeDelete(e: CustomEvent) {
        removeBadgeAnimation(badgeRef, strikeThroughRef);
        deleteQuestionTagById(tag.questionTagId);
    }

    async function handleExplanationAdd(e: CustomEvent) {
        tag.explanation = "Edit This Text to add"
        isVisible = true;
        await tick();
        explanationAppearAnimation(explanationRef);
    }

</script>

<div class="container" on:dblclick={handleDoubleClick} 
     on:mouseover={() => hoverLock ? undefined : hovered = true} on:mouseleave={() => hovered = false} bind:this={badgeRef}
     style={`--bg-color-1: ${tag.color}; --bg-color-2: ${adjustColor(tag.color, -15)}`}>
    <p bind:this={badgeLabelRef} class="label">{tag.label}</p> 
    {#if hovered}
        <div class="options-container">
            <BadgeOption on:optionClicked={handleBadgeDelete} optionType="deleteBadge"/>
            {#if tag.explanation.length == 0}
                <BadgeOption on:optionClicked={handleExplanationAdd} optionType="addExplanation"/>
            {/if}
        </div>
    {/if}

    {#if isVisible} 
        <div class="explanation-container" 
             bind:this={explanationRef} style={`--gradient-color: ${adjustColor(tag.color, 55)};`}>
            <EditableText on:finishedEditing={handleExplanationEdit} class="label" text={tag.explanation} /> 
        </div>
    {/if}
    <div class="strike-through" bind:this={strikeThroughRef}/>
</div>

<style>
    .container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 90px;
        background: linear-gradient(180deg, var(--bg-color-1), var(--bg-color-2));
        margin: 0 2px;
        padding: 3px 12px;
        color: white;
    }

    .explanation-container {
        direction: rtl;
        position: absolute;
        background: linear-gradient(180deg, #fff, var(--gradient-color));
        padding: 3px 15px;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
        top: -30px;
    }

    .strike-through {
        border-radius: 50%;
        position: absolute;
        width: 100%;
        height: 2px;
    }

    .options-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: -10px;
        right: -5px;
    }
    
    :global(.explanation-container p) {
        color: black;
        white-space: nowrap;
    }

    :global(.label) {
        font-weight: 500;
    }
</style>
