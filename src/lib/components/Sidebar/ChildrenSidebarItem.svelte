<script lang="ts">
    import { Menu, MenuItem } from "@tauri-apps/api/menu"

    import moment from "moment";

    import type { QuestionsCollection, Dialouge } from "../../typescript/types"
    import { deleteQuestionsCollectionById, updateQuestionsCollectionTitleById } from "../../../database";
    import { active_collection } from "../../stores/active_collection_store";
    import { active_dialouge } from "$lib/stores/active-dialouge-store";

    import EditableText from "$lib/GenericComponents/EditableText.svelte";
    import Seperator from "$lib/GenericComponents/Seperator.svelte";

    let selected = false;
    let ref: HTMLElement;

    async function handleClick() {
        active_collection.set(collection)
        // active_parent.set(await getParentCollectionById(collection.parent_collection_id))
    }

    async function handleTitleUpdate(e: CustomEvent) {
        const newTitle = e.detail.newText;

        await updateQuestionsCollectionTitleById(collection.id, newTitle)
    }

    async function deleteCollection() {
        let dialouge: Dialouge = {
            title: `Delete questions collection \"${collection.title}\"?`,
            content: "This action cannot be undone",
            opened: true,
            button: [
                {
                    text: "Confirm",
                    variant: "accent",
                    onClick: async () => {
                        ref.remove();
                        await deleteQuestionsCollectionById(collection.id)
                        $active_dialouge.callback();
                    }
                },
                {
                    text: "Cancel",
                    variant: "standard",
                    onClick: () => {
                        $active_dialouge.callback();
                    }
                }
            ],
            callback: $active_dialouge.callback
        }
        active_dialouge.set(dialouge);
    }

    async function showMenu() {
        const menuItems = await Promise.all([
            MenuItem.new({
                text: 'Delete Collection',
                action: async () => await deleteCollection(),
            }),
        ])

        const menu = await Menu.new({
            items: menuItems
        })

        await menu.popup();
    }

    export let collection: QuestionsCollection;

    let date = new Date(collection.createdAt);
    let updatedAtDate = new Date(collection.updatedAt);

    date.setHours(date.getHours()+3)
    updatedAtDate.setHours(updatedAtDate.getHours()+3)

    let localizedDate = date.toLocaleString('en-GB', { timeZone: "Africa/Cairo", hour12: true })

    let momentUpdatedAt = moment(updatedAtDate);
    let updatedAt = momentUpdatedAt.fromNow();

    active_collection.subscribe(col => col && 'questions' in col && col.id == collection.id ? selected = true : selected = false);

    setInterval(() => {
        updatedAt = momentUpdatedAt.fromNow();
    }, 1000)

</script>

<div
    bind:this={ref}
    on:contextmenu={showMenu}
    on:click={handleClick} class="container" class:selected={selected}>
    <EditableText tagType="h3" on:finishedEditing={handleTitleUpdate} class="questions-collection-item" text={collection.title} />
    <p class="date">{localizedDate}</p>
    {#if updatedAtDate.getFullYear() != 1970}
        <p class="date last-edited">{updatedAt}</p>
    {/if}
</div>

<Seperator color="#5a5a5a"/>

<style> 
    .container {
        padding: 20px 20px;
        width: 100%;
    }
    :global(.questions-collection-item) {
        font-size: 20px;
        margin-bottom: 20px;
        color: lightgray;
        width: fit-content;
    }
    .container:hover {
        background: #5a5a5a;
    }
    .selected {
        background: #2a2a2aaa;
    }
    .date {
        margin-top: 10px;
        font-size: 17px;
        font-weight: normal;
    }
    .last-edited {
        color: darkgrey;
    }
</style>
