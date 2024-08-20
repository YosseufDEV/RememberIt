<script lang="ts">
    import { get } from "svelte/store";

    import { active_parent } from "../../stores/active-parent-store";
    import NestedChildrenSidebarView from "../Views/NestedChildrenSidebarView.svelte";
    import ChildrenSidebarItem from "./ChildrenSidebarItem.svelte";

    let get_active_parent = get(active_parent);
    // TODO: Update THIS 
    $: activeParent = get_active_parent ? get_active_parent : { title: "", id: -1, child_collections: [], nested_parent_collections: [] };
    active_parent.subscribe((parent) => activeParent = parent);

</script>

<div class="container">
    {#each activeParent.child_collections as childCollection (childCollection.id)}
    <ChildrenSidebarItem collection={childCollection} />
    {/each}
    <!-- FIX: Clicking on any nested child will change parent -->
    <NestedChildrenSidebarView collection={activeParent}/>
    <!-- {#each activeParent.nested_parent_collections as childCollection (childCollection.id)} -->
    <!--     <SidebarItemChild collection={childCollection} /> -->
    <!-- {/each} -->
    <!-- <AddCollectionForm on:addCollection={handleCollectionSubmit} /> -->
</div>

<style>
    .container {
        background: rgba(0, 0, 0, 0.89);
        width: 35%;
        height: 100%;
        display: flex; 
        flex-direction: column;
        align-items: right;
    }
</style>
