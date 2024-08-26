<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { TextBox, Button } from "fluent-svelte"

    let dispatch = createEventDispatcher();
    let title: string = "";

    function handleSubmit() {
        let titleObj = {
            title: title
        }

        dispatch("addParentCollection", titleObj);
    }

</script>

<form class="form" on:submit|preventDefault={handleSubmit}>
    <TextBox placeholder="Parent Title..." bind:value={title}/>
    <Button variant="accent">Add</Button>
</form>

<style>
    .form {
        display: flex;
    }
</style>
