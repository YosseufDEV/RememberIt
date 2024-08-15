<script lang="ts">
    import { get } from "svelte/store";

    import SidebarItemChild from "./SidebarItemChild.svelte";

    import { active_parent } from "../../active-parent-store";

    $: activeParent = get(active_parent) ? get(active_parent) : { title: "", id: -1, child_collections: [] };
    active_parent.subscribe((parent) => activeParent = parent);

</script>

<div class="container">
    {#each activeParent.child_collections as childCollection (childCollection.id)}
        <SidebarItemChild id={childCollection.id} name={childCollection.title} />
    {/each}
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
