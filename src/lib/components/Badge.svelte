<script lang="ts">
    import { tick } from "svelte";

    import type { QuestionSpecificTag } from "../typescript/types";
    import { badgeTapAnimation, badgeTapOutAnimation, darkenBadgeGradient, explanationAppearAnimation, explanationDisappearAnimation, shakeBadge } from "./Animations/BadgeAnimations";
    import { adjustColor } from "$lib/typescript/color_generator";
    import EditableText from "$lib/GenericComponents/EditableText.svelte";
    import { invoke } from "@tauri-apps/api/core";
    import { updateQuestionTagExplanationByBothIds } from "../../database";

    export let tag: QuestionSpecificTag, questionId: number;
    let badgeRef: HTMLElement, 
        strikeThroughRef: HTMLElement,
        explanationRef: HTMLElement,
        badgeLabelRef: HTMLElement;
    $: isVisible = false;
    let gradientAnimationTimeline: GSAPTimeline;

    async function handleDoubleClick(e: MouseEvent) {
        // removeBadgeAnimation(badgeRef, strikeThroughRef);
        if(e.target != badgeRef && e.target != badgeLabelRef) return;
        if(!isVisible) {
            if(tag.explanation.length > 0) {
                gradientAnimationTimeline = darkenBadgeGradient(badgeRef, tag.color);
                isVisible = true;
                badgeTapAnimation(badgeRef);
                await tick();
                explanationAppearAnimation(explanationRef);
            } else {
                shakeBadge(badgeRef); 
            }
        } else {
            await tick();
            badgeTapOutAnimation(badgeRef);
            gradientAnimationTimeline.revert();
            explanationDisappearAnimation(explanationRef).then(() => {
                isVisible = false;
            });
        }
    }

    async function handleExplanationEdit(e: CustomEvent) {
        const newExplanation = e.detail.newText;

        await updateQuestionTagExplanationByBothIds(questionId, tag.id, newExplanation);
    }

</script>

<div class="container" on:dblclick={handleDoubleClick} bind:this={badgeRef}
     style={`--bg-color-1: ${tag.color}; --bg-color-2: ${adjustColor(tag.color, -15)}`}>
    <p bind:this={badgeLabelRef} class="label">{tag.label}</p> 
    {#if isVisible} 
        <div class="explanation-container" 
             bind:this={explanationRef} style={`--gradient-color: ${adjustColor(tag.color, 55)};`}>
            <EditableText on:finishedEditing={handleExplanationEdit} class="label" text={tag.explanation} /> 
        </div>
    {/if}
    <div bind:this={strikeThroughRef}/>
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
    
    :global(.explanation-container p) {
        color: black;
        white-space: nowrap;
    }

    :global(.label) {
        font-weight: 500;
    }
</style>
