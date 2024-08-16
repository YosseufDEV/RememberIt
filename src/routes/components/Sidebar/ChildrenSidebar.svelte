<script lang="ts">
    import { get } from "svelte/store";

    import SidebarItemChild from "./SidebarItemChild.svelte";

    import { active_parent } from "../../active-parent-store";
    import NestedChildrenSidebarView from "../Views/NestedChildrenSidebarView.svelte";

    let get_active_parent = get(active_parent);
    $: activeParent = get_active_parent ? get_active_parent : { title: "", id: -1, child_collections: [], nested_parent_collections: [] };
    active_parent.subscribe((parent) => activeParent = parent);

</script>

<div class="container">
    {#each activeParent.child_collections as childCollection (childCollection.id)}
        <SidebarItemChild collection={childCollection} />
    {/each}
    <NestedChildrenSidebarView collection={activeParent}/>
    <!-- {#each activeParent.nested_parent_collections as childCollection (childCollection.id)} -->
    <!--     <SidebarItemChild collection={childCollection} /> -->
    <!-- {/each} -->
    <!-- <AddCollectionForm on:addCollection={handleCollectionSubmit} /> -->
</div>

<style>
    .container {
        background: #e5e5e5;
        width: 25%;
        height: 100%;
        display: flex; 
        flex-direction: column;
        align-items: right;
    }
</style>
