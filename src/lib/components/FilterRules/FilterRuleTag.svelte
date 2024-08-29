<script lang="ts">
    import ChromeClose from "$lib/assets/icons/ChromeClose.svelte";
    import { createEventDispatcher } from "svelte";
    import type { Tag } from "../../typescript/types";

    export let tag: Tag;
    const dispatch = createEventDispatcher();

    function handleClose() {
        dispatch("removeFilter", { tag })
    }

</script>

<div class="container" style={`background: ${tag.color}`}>
    <p class="label">{tag.label}</p> 
    <div class="close-icon-container" on:click={handleClose}>
        <ChromeClose size={13}/>
    </div>
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

    .close-icon-container {
        display: flex;
        margin-left: 10px;
    }

    .label {
        font-weight: 500;
    }
</style>
