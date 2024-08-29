<script lang="ts">
    import type { Tag } from "../typescript/types";
    import { removeBadgeAnimation } from "./Animations/BadgeAnimations";

    export let tag: Tag;
    let badgeRef: HTMLElement, strikeThroughRef: HTMLElement;

    function handleDoubleClick(e: MouseEvent) {
        removeBadgeAnimation(badgeRef, strikeThroughRef);
        console.log('Double Clicked');
    }

</script>

<div class="container" on:dblclick={handleDoubleClick} bind:this={badgeRef}
     style={`background: ${tag.color}; box-shadow: 0 0 50px ${tag.color}a5;`}>
    <p class="label">{tag.label}</p> 
    <div bind:this={strikeThroughRef}/>
</div>

<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        background: #000;
        margin: 0 2px;
        padding: 3px 12px;
        color: white;
    }

    .label {
        font-weight: 500;
    }
</style>
