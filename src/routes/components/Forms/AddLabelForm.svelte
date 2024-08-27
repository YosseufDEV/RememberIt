<script lang="ts">
    import { get } from "svelte/store";
    import colors from "$lib/assets/colors/colors.json"

    import { Button, TextBox } from "fluent-svelte";
    import { insertReason } from "../../../database";
    import { DATABASE, TAGS_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";
    import generateColor from "../../typescript/color_generator";

    let label: string = "";

    function handleSubmit(e: SubmitEvent) {
        let oldDB = get(DATABASE);

        insertReason(label, generateColor(colors)).then((reason) => {
            oldDB.tags.push({ id: reason.id, label: reason.label, color: reason.color })
            DATABASE.set(oldDB);
            TAGS_SLICE_DATABASE.set(oldDB.tags)
        });
    }

</script>

<form on:submit|preventDefault={handleSubmit}>
    <TextBox placeholder="Add Label" bind:value={label} type="text"/>
    <Button variant="accent">Add</Button>
</form>

