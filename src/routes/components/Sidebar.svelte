<script lang="ts">
    import AddCollectionForm from "./AddCollectionForm.svelte";
    import SideBarItem from "./SideBarItem.svelte";
    import { invoke } from "@tauri-apps/api/core";
    import { createCollection, createParentCollection, getAllParentCollections, getCollectionTitles } from "../../database"
    import AddParentCollectionForm from "./AddParentCollectionForm.svelte";
    import type { ParentCollection, QuestionsCollection } from "../types";

    $: parentCollections = [] as ParentCollection[];

    async function handleCollectionSubmit(e: CustomEvent) {
        createCollection(e.detail.title);
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
