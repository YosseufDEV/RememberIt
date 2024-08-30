<script lang="ts">
    import { tick } from "svelte";

    import type { QuestionSpecificTag } from "../typescript/types";
    import { badgeTapAnimation, badgeTapOutAnimation, explanationAppearAnimation, explanationDisappearAnimation } from "./Animations/BadgeAnimations";
    import { adjustColor } from "$lib/typescript/color_generator";

    export let tag: QuestionSpecificTag;
    let badgeRef: HTMLElement, 
        strikeThroughRef: HTMLElement,
        explanationRef: HTMLElement;
    $: isVisible = false;

    async function handleDoubleClick() {
        // removeBadgeAnimation(badgeRef, strikeThroughRef);
        // console.log('Double Clicked');
        if(!isVisible) {
            isVisible = true;
            await tick();
            badgeTapAnimation(badgeRef);
            explanationAppearAnimation(explanationRef);
        } else {
            badgeTapOutAnimation(badgeRef);
            explanationDisappearAnimation(explanationRef).then(() => {
                isVisible = false;
            });
        }
    }
</script>

<div class="container" on:dblclick={handleDoubleClick} bind:this={badgeRef}
     style={`--bg-color-1: ${tag.color}; --bg-color-2: ${adjustColor(tag.color, -15)}`}>
    <p class="label">{tag.label}</p> 
    {#if isVisible} 
        <div class="explanation-container" 
             bind:this={explanationRef} style={`--gradient-color: ${adjustColor(tag.color, 55)};`}>
            <p class="label">{tag.explanation}</p> 
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
        position: absolute;
        z-index: inherit;
        background: linear-gradient(180deg, #fff, var(--gradient-color));
        padding: 3px 15px;
        border-radius: 10px;
        width: fit-content;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
        top: -30px;
    }
    
    .explanation-container p {
        color: black;
        white-space: nowrap;
    }

    .label {
        font-weight: 500;
    }
</style>
