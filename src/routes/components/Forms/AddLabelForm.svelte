<script lang="ts">
    import { createEventDispatcher } from "svelte";

    let dispatch = createEventDispatcher();
    let label: string = "";

    function handleSubmit() {
        dispatch("addCollection", { label });
    }

</script>

<form on:submit|preventDefault={handleSubmit}>
    <input placeholder="Add Label" bind:value={label} type="text">
    <button>Add</button>
</form>

