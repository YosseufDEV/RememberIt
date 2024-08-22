<script lang="ts">
    import { get } from "svelte/store";

    import type { ParentCollection, Reason } from "../../typescript/types";
    import { DATABASE, TAGS_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";
    import { createCollection, createNestedParentCollection, 
             createParentCollection, 
             getAllParentCollections, 
             getParentCollectionById, 
             insertReason } from "../../../database"
    import { active_collection } from "../../stores/active_collection_store";
    import { active_parent } from "../../stores/active-parent-store";

    import AddCollectionForm from "../Forms/AddCollectionForm.svelte";
    import SideBarItem from "./SideBarItem.svelte";
    import AddParentCollectionForm from "../Forms/AddParentCollectionForm.svelte";
    import AddLabelForm from "../Forms/AddLabelForm.svelte";
    import AddNestedParent from "../Forms/AddNestedParent.svelte";
    import TagsView from "../Views/ParentSidebar/TagsView.svelte";
    import { onMount } from "svelte";
    import Notebook from "$lib/assets/icons/Notebook.svelte";


    $: parentCollections = [] as ParentCollection[];
    let reasons: Reason[];

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
    }

    async function handleParentCollectionSubmit(e: CustomEvent) {
        createParentCollection(e.detail.title);
    }

    async function handleNestedParentCollectionSubmit(e: CustomEvent) {
        let activeParent = get(active_parent)
        if(active_parent)
            createNestedParentCollection(e.detail.title, activeParent.id);
    }

    async function handleLabelSubmit(e: CustomEvent) {
        let oldDB = get(DATABASE);
        let reason: Reason = e.detail;

        oldDB.tags.push({ id: reason.id, label: reason.label, color: reason.color })
        DATABASE.set(oldDB);
        TAGS_SLICE_DATABASE.set(oldDB.tags)

        insertReason(e.detail.label, e.detail.color);
    }

    onMount(async () => {
        parentCollections = await getAllParentCollections(true);
    })

</script>

<div class="container">
    <div class="tags-icon-container">
        <Notebook size={33}/>
        <p class="tags-text">Questions</p>
    </div>
    <div class="collections-container">
        {#each parentCollections as collection (collection.id)}
            <SideBarItem handleClick={(e) => 
                handleParnetClick(e, collection.id)} collection={collection} />
        {/each}
    </div>
    <AddParentCollectionForm on:addParentCollection={handleParentCollectionSubmit}/>
    <AddCollectionForm on:addCollection={handleCollectionSubmit} />
    <AddNestedParent on:addedNestedParent={handleNestedParentCollectionSubmit}/>
    <AddLabelForm on:addCollection={handleLabelSubmit}/>
    <TagsView />
</div>

<style>
    .tags-icon-container {
        display: flex;
        align-items: center;
        justify-content: left;
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .tags-icon-container p {
        margin-left: 10px;
        font-size: 22px;
    }
    
    .container {
        background: rgba(0, 0, 0, 0.8);
        padding: 0px 10px;
        width: 45%;
        height: 100%;
        display: flex; 
        flex-direction: column;
        align-items: right;
    }

    .collections-container {
        margin-left: 15px;
    }

</style>
