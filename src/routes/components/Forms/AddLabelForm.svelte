<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import generateColor from "../../typescript/color_generator";
    import colors from "$lib/assets/colors/colors.json"

    let dispatch = createEventDispatcher();
    let label: string = "";

    function handleSubmit() {
        dispatch("addCollection", { label, color: generateColor(colors) });
    }

</script>

<form on:submit|preventDefault={handleSubmit}>
    <input placeholder="Add Label" bind:value={label} type="text">
    <button>Add</button>
</form>

