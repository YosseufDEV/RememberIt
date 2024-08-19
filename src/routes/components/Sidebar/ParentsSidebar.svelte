<script lang="ts">
    import { get } from "svelte/store";

    import { createCollection, createNestedParentCollection, 
             createParentCollection, 
             getAllParentCollections, 
             getAllReasons, 
             getParentCollectionById, 
             insertReason } from "../../../database"
    import type { ParentCollection } from "../../typescript/types";
    import { active_collection } from "../../stores/active_collection_store";
    import { active_parent } from "../../stores/active-parent-store";
    import AddCollectionForm from "../Forms/AddCollectionForm.svelte";
    import SideBarItem from "./SideBarItem.svelte";
    import AddParentCollectionForm from "../Forms/AddParentCollectionForm.svelte";
    import AddLabelForm from "../Forms/AddLabelForm.svelte";
    import AddNestedParent from "../Forms/AddNestedParent.svelte";
    import TagSidebarItem from "./TagSidebarItem.svelte";


    $: parentCollections = [] as ParentCollection[];

    // BUG: Would throw an error when the selected element is not a parent

    async function handleParnetClick(e: MouseEvent, id: number) {
        const parent = await getParentCollectionById(id)
        active_collection.set(parent)
        active_parent.set(parent)
    }

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

    async function handleNestedParentCollectionSubmit(e: CustomEvent) {
        let activeParent = get(active_parent)
        if(active_parent)
            createNestedParentCollection(e.detail.title, activeParent.id);
        fetchCollections();

    }

    async function handleLabelSubmit(e: CustomEvent) {
        insertReason(e.detail.label, e.detail.color);
    }

    async function fetchCollections() {
        // true is for getting all "UNNESTED" parents (first level)
        parentCollections = await getAllParentCollections(true);
    }


</script>

<div class="container">
    {#await fetchCollections() then } 
        {#each parentCollections as collection (collection.id)}
            <SideBarItem handleClick={(e) => handleParnetClick(e, collection.id)} collection={collection} />
        {/each}
    {/await}
    {#await getAllReasons() }
        {:then reasons}
            {#each reasons as reason}
                <TagSidebarItem tag={reason}/>
            {/each}
    {/await}
    <AddParentCollectionForm on:addParentCollection={handleParentCollectionSubmit}/>
    <AddCollectionForm on:addCollection={handleCollectionSubmit} />
    <AddNestedParent on:addedNestedParent={handleNestedParentCollectionSubmit}/>
    <AddLabelForm on:addCollection={handleLabelSubmit}/>
</div>

<style>
    .container {
        background: rgba(0, 0, 0, 0.8);
        padding: 0px 10px;
        width: 35%;
        height: 100%;
        display: flex; 
        flex-direction: column;
        align-items: right;
    }
</style>
