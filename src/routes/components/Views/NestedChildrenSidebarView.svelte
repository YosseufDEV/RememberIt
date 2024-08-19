<script lang="ts">
    import type { ParentCollection } from "../../typescript/types";
    import SidebarItemChild from "../Sidebar/SidebarItemChild.svelte";

    export let collection: ParentCollection;
</script>

<div>
    {#each collection.nested_parent_collections  as nested_collection (nested_collection.id)}
        {#each nested_collection.child_collections  as child_collection (child_collection.id)}
            <SidebarItemChild collection={child_collection}/>
        {/each}
    {/each}
</div>
