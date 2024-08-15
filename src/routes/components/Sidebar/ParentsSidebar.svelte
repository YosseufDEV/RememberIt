<script lang="ts">
    import { get } from "svelte/store";

    import AddCollectionForm from "../AddCollectionForm.svelte";
    import SideBarItem from "./SideBarItem.svelte";
    import AddParentCollectionForm from "../AddParentCollectionForm.svelte";
    import SidebarItemChild from "./SidebarItemChild.svelte";

    import type { ParentCollection, QuestionsCollection } from "../../types";
    import { createCollection, createParentCollection, getAllParentCollections, getCollectionTitles } from "../../../database"
    import { active_collection } from "../../active_collection_store";

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
