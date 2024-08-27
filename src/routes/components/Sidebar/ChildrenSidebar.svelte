<script lang="ts">
    import { get } from "svelte/store";

    import { PARENTS_SLICE_DATABASE, QUESTION_COLLECTION_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";
    import { active_parent, active_parent_index } from "../../stores/active-parent-store";
    import NestedChildrenSidebarView from "../Views/NestedChildrenSidebarView.svelte";
    import ChildrenSidebarItem from "./ChildrenSidebarItem.svelte";
    import Seperator from "$lib/GenericComponents/Seperator.svelte";

    const activeParentIndex = get(active_parent_index);
    let parents = get(PARENTS_SLICE_DATABASE);

    // TODO: Make this better
    $: activeParentCollection = activeParentIndex ? parents[activeParentIndex] : {
        id: -1,
        child_collections: [],
        nested_parent_collections: [],
    };

    active_parent.subscribe((activeParent) => activeParent ? activeParentCollection = activeParent : null);

    QUESTION_COLLECTION_SLICE_DATABASE.subscribe((col) => {
        if(activeParentCollection) {
            activeParentCollection.child_collections = col.filter((c) => c.parent_collection_id == activeParentCollection.id)
        }
    })

</script>

<div class="container">
    {#each activeParentCollection.child_collections as childCollection (childCollection.id)}
        <ChildrenSidebarItem collection={childCollection}/>
    {/each}
    <NestedChildrenSidebarView nestedParentTitle={activeParentCollection.title} collection={activeParentCollection} />
</div>

<style>
    .container {
        overflow-y: scroll;
        padding: 40px 10px;
        background: rgba(0, 0, 0, 0.89);
        direction: ltr;
        min-width: 25%;
        height: 100%;
        display: flex; 
        flex-direction: column;
        align-items: right;
    }
</style>
