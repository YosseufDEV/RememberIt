<script lang="ts">
    import { get } from "svelte/store";

    import { PARENTS_SLICE_DATABASE, QUESTION_COLLECTION_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";
    import { active_parent, active_parent_index } from "../../stores/active-parent-store";
    import NestedChildrenSidebarView from "$lib/Views/ChildrenSidebar/NestedChildrenSidebarView.svelte";
    import ChildrenSidebarItem from "./ChildrenSidebarItem.svelte";
    import Seperator from "$lib/GenericComponents/Seperator.svelte";

    const activeParentIndex = $active_parent_index;
    let parents = $PARENTS_SLICE_DATABASE;

    // TODO: Make this better
    $: activeParentCollection = activeParentIndex ? parents[activeParentIndex] : {
        id: -1,
        questionsCollections: [],
        subCollections: [],
    };


    QUESTION_COLLECTION_SLICE_DATABASE.subscribe((col) => {
        if(activeParentCollection) {
            activeParentCollection.questionsCollections = col.filter((c) => c.parentId == activeParentCollection.id)
        }
    })

    active_parent.subscribe((activeParent) => activeParent ? activeParentCollection = activeParent : null);

</script>

<div class="main-container">
    <div
        class="container">
        {#each activeParentCollection.questionsCollections as childCollection (childCollection.id)}
            <ChildrenSidebarItem collection={childCollection}/>
        {/each}
        <NestedChildrenSidebarView parentsTitleArray={[activeParentCollection.title]} collection={activeParentCollection} />
    </div>

</div>

<style>
    .container {
        overflow-x: hidden;
        overflow-y: scroll;
        background: rgba(0, 0, 0, 0.85);
        min-width: 25%;
        width: 100%;
        height: 100%;
        display: flex; 
        flex-direction: column;
        align-items: right;
        overflow-y: scroll;
    }

    .main-container {
        overflow-x: hidden;
        min-width: 25%;
        height: 100%;
        display: flex; 
        flex-direction: column;
        align-items: right;
    }
</style>
