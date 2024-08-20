<script lang="ts">
    import type { ParentCollection } from "../../typescript/types";
    import ChildrenSidebarItem from "../Sidebar/ChildrenSidebarItem.svelte";

    export let collection: ParentCollection;
</script>

<div>
    {#each collection.nested_parent_collections  as nested_collection (nested_collection.id)}
        {#if nested_collection.child_collections.length > 0}
            <h2>{nested_collection.title}</h2>
        {/if}
        {#each nested_collection.child_collections  as child_collection (child_collection.id)}
            <ChildrenSidebarItem collection={child_collection}/>
        {/each}
    {/each}
</div>
