<script lang="ts">
    import AddIcon from "$lib/assets/icons/AddIcon.svelte";
    import ChromeMinimize from "$lib/assets/icons/ChromeMinimize.svelte";
    import { createEventDispatcher } from "svelte";

    type OptionType = "addExplanation" | "deleteBadge"
    export let optionType: OptionType;
    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch("optionClicked", { type: optionType })
    }

</script>

<div class="container" on:click={handleClick}>
    {#if optionType=="addExplanation"}
        <AddIcon size={25} color={"green"} />
    {/if}

    {#if optionType=="deleteBadge"}
        <ChromeMinimize size={10} color={"red"} />
    {/if}
</div>

<style>
    .container {
        display: flex;
        align-items: center;
        padding: 5px;
        justify-content: center;
        aspect-ratio: 1;
        margin-right: 5px;
        width: 15px;
        height: 15px;
        background: white;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        border-radius: 50px;
    }

    .container:active {
        filter: brightness(50%);
    }

</style>
