<script lang="ts">
    import { get } from "svelte/store";

    import { createCollection, createNestedParentCollection, 
             createParentCollection, 
             getAllParentCollections, 
             getAllReasons, 
             getParentCollectionById, 
             insertReason } from "../../../database"
    import { active_collection } from "../../stores/active_collection_store";
    import { active_parent } from "../../stores/active-parent-store";
    import type { ParentCollection, Reason } from "../../typescript/types";
    import AddCollectionForm from "../Forms/AddCollectionForm.svelte";
    import SideBarItem from "./SideBarItem.svelte";
    import AddParentCollectionForm from "../Forms/AddParentCollectionForm.svelte";
    import AddLabelForm from "../Forms/AddLabelForm.svelte";
    import AddNestedParent from "../Forms/AddNestedParent.svelte";
    import TagSidebarItem from "./TagSidebarItem.svelte";
    import { DATABASE } from "../../typescript/Database/CachedDatabase";
    import TagsView from "../Views/ParentSidebar/TagsView.svelte";


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
        let oldDB = get(DATABASE);
        let reason: Reason = e.detail;

        oldDB.tags.push({ id: reason.id, label: reason.label, color: reason.color })
        DATABASE.set(oldDB);

        insertReason(e.detail.label, e.detail.color);
    }

    async function fetchCollections() {
        // true is for getting all "UNNESTED" parents (first level)
        parentCollections = await getAllParentCollections(true);
    }

    DATABASE.subscribe((db) => {
        reasons = db.tags 
    })



</script>

<div class="container">
    {#await fetchCollections() then } 
        {#each parentCollections as collection (collection.id)}
            <SideBarItem handleClick={(e) => handleParnetClick(e, collection.id)} collection={collection} />
        {/each}
    {/await}
    <AddParentCollectionForm on:addParentCollection={handleParentCollectionSubmit}/>
    <AddCollectionForm on:addCollection={handleCollectionSubmit} />
    <AddNestedParent on:addedNestedParent={handleNestedParentCollectionSubmit}/>
    <AddLabelForm on:addCollection={handleLabelSubmit}/>
    <TagsView />
</div>

<style>
    .container {
        background: rgba(0, 0, 0, 0.8);
        padding: 0px 10px;
        width: 45%;
        height: 100%;
        display: flex; 
        flex-direction: column;
        align-items: right;
    }
</style>
