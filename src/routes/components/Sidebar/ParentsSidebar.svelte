<script lang="ts">
    import { get } from "svelte/store";

    import AddCollectionForm from "../Forms/AddCollectionForm.svelte";
    import SideBarItem from "./SideBarItem.svelte";
    import AddParentCollectionForm from "../Forms/AddParentCollectionForm.svelte";
    import SidebarItemChild from "./SidebarItemChild.svelte";

    import type { ParentCollection, QuestionsCollection } from "../../types";
    import { createCollection, createParentCollection, getAllParentCollections, getCollectionTitles, insertReason } from "../../../database"
    import { active_collection } from "../../active_collection_store";
    import AddLabelForm from "../Forms/AddLabelForm.svelte";

    $: parentCollections = [] as ParentCollection[];

    // BUG: Would throw an error when the selected element is not a parent
    async function handleCollectionSubmit(e: CustomEvent) {
        let parent = get(active_collection);
        if(parent) {
            createCollection(e.detail.title, parent.id);
        }
        fetchCollections();

    }

    async function handleParentCollectionSubmit(e: CustomEvent) {
        createParentCollection(e.detail.title);
        fetchCollections();

    }

    async function handleLabelSubmit(e: CustomEvent) {
        insertReason(e.detail.label);
    }

    async function fetchCollections() {
        parentCollections = await getAllParentCollections();
    }


</script>

<div class="container">
    {#await fetchCollections() } {/await}
    {#each parentCollections as collection (collection.id)}
        <SideBarItem id={collection.id} name={collection.title} />
    {/each}
    <AddParentCollectionForm on:addParentCollection={handleParentCollectionSubmit}/>
    <AddCollectionForm on:addCollection={handleCollectionSubmit} />
    <AddLabelForm on:addCollection={handleLabelSubmit}/>
</div>

<style>
    .container {
        background: white;
        width: 25%;
        height: 100%;
        display: flex; 
        flex-direction: column;
        align-items: right;
    }
</style>
