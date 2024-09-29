<script lang="ts">
    import { get } from "svelte/store";
    import colors from "$lib/assets/colors/colors.json"

    import { Button, TextBox } from "fluent-svelte";
    import { insertTag } from "../../../database";
    import { DATABASE } from "../../typescript/Database/CachedDatabase";
    import { generateColor } from "../../typescript/color_generator";

    let label: string = "";

    function handleSubmit(e: SubmitEvent) {
        let oldDB = get(DATABASE);

        insertTag(label, generateColor(colors)).then((tag) => {
            oldDB.tags.push({ id: tag.id, label: tag.label, color: tag.color })
            DATABASE.set(oldDB);
        });
    }

</script>

<form on:submit|preventDefault={handleSubmit}>
    <TextBox placeholder="Add Label" bind:value={label} type="text"/>
    <Button variant="accent">Add</Button>
</form>

