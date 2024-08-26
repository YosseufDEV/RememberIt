<script lang="ts">
    import { onMount } from "svelte";
    import { get } from "svelte/store";


    import type { ParentCollection, Reason } from "../../typescript/types";
    import { createCollection, createNestedParentCollection, 
             createParentCollection, 
             getAllParentCollections, 
             getParentCollectionById, 
             insertReason } from "../../../database"
    import { active_collection } from "../../stores/active_collection_store";
    import { active_parent, active_parent_index } from "../../stores/active-parent-store";
    import { DATABASE, PARENTS_SLICE_DATABASE, QUESTION_COLLECTION_SLICE_DATABASE, TAGS_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";

    import AddCollectionForm from "../Forms/AddCollectionForm.svelte";
    import SideBarItem from "./SideBarItem.svelte";
    import AddParentCollectionForm from "../Forms/AddParentCollectionForm.svelte";
    import AddLabelForm from "../Forms/AddLabelForm.svelte";
    import AddNestedParent from "../Forms/AddNestedParent.svelte";
    import TagsView from "../Views/ParentSidebar/TagsView.svelte";
    import Notebook from "$lib/assets/icons/Notebook.svelte";


    $: parentCollections = get(PARENTS_SLICE_DATABASE);
    let reasons: Reason[];

    async function handleParnetClick(e: MouseEvent, id: number) {
        const parent = await getParentCollectionById(id)
        const index = parentCollections.findIndex((pCol) => pCol.id == parent.id);
        active_collection.set(parent)
        active_parent.set(parent)
        active_parent_index.set(index);
    }

    async function handleCollectionSubmit(e: CustomEvent) {
        let parent = get(active_collection);
        if(parent) {
            let c = await createCollection(e.detail.title, parent.id);
            c.questions = [];
            let oldDB = get(QUESTION_COLLECTION_SLICE_DATABASE);
            oldDB.push(c);
            QUESTION_COLLECTION_SLICE_DATABASE.set(oldDB);
        }
    }

    async function handleParentCollectionSubmit(e: CustomEvent) {
        let parent = await createParentCollection(e.detail.title);
        parent.child_collections = []
        parent.nested_parent_collections = []
        console.log({parent});

        const oldDB = parentCollections;
        oldDB.push(parent);
        PARENTS_SLICE_DATABASE.set(oldDB);
    }

    async function handleNestedParentCollectionSubmit(e: CustomEvent) {
        let activeParent = get(active_parent)
        if(active_parent) {
            let parent = await createNestedParentCollection(e.detail.title, activeParent.id);
            parent.child_collections = []
            parent.nested_parent_collections = []
            const oldDB = parentCollections; 
            oldDB[get(active_parent_index)].nested_parent_collections.push(parent);
            PARENTS_SLICE_DATABASE.set(oldDB);
        }
    }

    PARENTS_SLICE_DATABASE.subscribe((pCol) => {
        parentCollections = pCol;
    })

</script>

<div class="main-container">
    <div class="container">
        <div class="question-icon-container">
            <Notebook size={33}/>
            <p class="question-text">Questions</p>
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
        <AddLabelForm />
        <TagsView />
    </div>
</div>

<style>
    .main-container {
        background: rgba(0, 0, 0, 0.8);
        padding: 40px 7px;
        padding-bottom: 10px;
        min-width: 21%;
        display: flex; 
        flex-direction: column;
    }
    
    .container {
        padding: 0 12px;
        overflow-y: scroll;
    }

    .collections-container {
        margin-left: 15px;
        margin-bottom: 20px;
    }

    .question-icon-container {
        display: flex;
        align-items: center;
        justify-content: left;
        margin-bottom: 15px;
    }

    .question-icon-container p {
        margin-left: 10px;
        font-size: 22px;
    }
</style>
