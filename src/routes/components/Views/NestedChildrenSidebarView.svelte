<script lang="ts">
    import Seperator from "$lib/GenericComponents/Seperator.svelte";
    import type { ParentCollection } from "../../typescript/types";
    import ChildrenSidebarItem from "../Sidebar/ChildrenSidebarItem.svelte";

    export let collection: ParentCollection;
</script>

<div>
    {#each collection.nested_parent_collections  as nested_collection (nested_collection.id)}
        <div class="container">
            {#if nested_collection.child_collections.length > 0}
                <h2 class="collection-title">{nested_collection.title}</h2>
            {/if}
            {#each nested_collection.child_collections  as child_collection (child_collection.id)}
                <ChildrenSidebarItem collection={child_collection}/>
            {/each}
        </div>
        <Seperator color="#3e3e3e" />
        <svelte:self collection={nested_collection}/>
    {/each}
</div>

<style>
    .container {
        padding: 0 20px;
    }

    .collection-title {
        font-size: 22px;
        font-weight: 500;
        margin-bottom: 10px;
    }
</style>
