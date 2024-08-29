<script lang="ts">
    import { get } from "svelte/store";


    import type { Tag } from "../../typescript/types";
    import { getCollectionById } from "../../../database"
    import { active_collection } from "../../stores/active_collection_store";
    import { active_parent } from "../../stores/active-parent-store";
    import { PARENTS_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";

    import AddParentCollectionForm from "../Forms/AddParentCollectionForm.svelte";
    import SideBarItem from "./SideBarItem.svelte";
    import AddNestedParent from "../Forms/AddNestedParent.svelte";
    import AddLabelForm from "../Forms/AddLabelForm.svelte";
    import TagsView from "../Views/ParentSidebar/TagsView.svelte";
    import Notebook from "$lib/assets/icons/Notebook.svelte";
    import AddCollectionForm from "../Forms/AddCollectionForm.svelte";


    $: parentCollections = get(PARENTS_SLICE_DATABASE);

    async function handleParnetClick(e: MouseEvent, id: number) {
        const parent = await getCollectionById(id)
        active_collection.set(parent)
        active_parent.set(parent)
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
        <AddCollectionForm />
        <AddParentCollectionForm />
        <AddNestedParent />
        <AddLabelForm />
        <TagsView />
    </div>
</div>

<style>
    .main-container {
        background: rgba(0, 0, 0, 0.8);
        height: 100%;
        padding: 40px 5px;
        padding-bottom: 10px;
        min-width: 21%;
        display: flex; 
        flex-direction: column;
    }
    
    .container {
        padding: 0 5px;
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
