<script lang="ts">
    import SideBarItem from "./SideBarItem.svelte";
    import { getParentCollectionById } from "../../../database";
    import { active_parent } from "../../stores/active-parent-store";
    import { active_collection } from "../../stores/active_collection_store";
    import type { ParentCollection } from "../../typescript/types";


    async function handleClick(id: number) {
        const parent = await getParentCollectionById(id)
        active_collection.set(parent)
        active_parent.set(parent)
    }

    export let collection: ParentCollection;
</script>

<div>
    {#each collection.nested_parent_collections as nested_collection }
        <SideBarItem handleClick={() => handleClick(nested_collection.id)} collection={nested_collection} />
    {/each}
</div>

<style> 
</style>
