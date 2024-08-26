<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { TextBox, Button } from "fluent-svelte"

    let dispatch = createEventDispatcher();
    let title: string = "";

    function handleSubmit() {
        let titleObj = {
            title: title
        }

        dispatch("addCollection", titleObj);
    }

</script>

<form on:submit|preventDefault={handleSubmit}>
    <TextBox placeholder="Title" bind:value={title} type="text"/>
    <Button variant="accent">Add</Button>
</form>

