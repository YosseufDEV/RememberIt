<script lang="ts">
    import { get } from "svelte/store";

    import { active_parent } from "../../stores/active-parent-store";
    import NestedChildrenSidebarView from "../Views/NestedChildrenSidebarView.svelte";
    import ChildrenSidebarItem from "./ChildrenSidebarItem.svelte";

    let get_active_parent = get(active_parent);
    // TODO: Update THIS 
    $: activeParent = get_active_parent ? get_active_parent : { title: "", id: 0, child_collections: [], nested_parent_collections: [] };
    active_parent.subscribe((parent) => activeParent = parent);

</script>

<div class="container">
    {#each activeParent.child_collections as childCollection (childCollection.id)}
        <ChildrenSidebarItem collection={childCollection}/>
    {/each}
    <NestedChildrenSidebarView collection={activeParent}/>
</div>

<style>
    .container {
        padding: 40px 0px;
        background: rgba(0, 0, 0, 0.89);
        direction: ltr;
        min-width: 25%;
        height: 100%;
        display: flex; 
        flex-direction: column;
        align-items: right;
    }
</style>
