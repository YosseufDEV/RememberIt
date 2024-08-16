<script lang="ts">
    import { createEventDispatcher } from "svelte";

    let dispatch = createEventDispatcher();
    let title: string = "";

    function handleSubmit() {
        let titleObj = {
            title: title
        }

        dispatch("addedNestedParent", titleObj);
    }

</script>

<form on:submit|preventDefault={handleSubmit}>
    <input placeholder="Nested Parent Title" bind:value={title} type="text">
    <button>Add</button>
</form>

