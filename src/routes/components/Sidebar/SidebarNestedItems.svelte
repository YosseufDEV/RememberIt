<script lang="ts">
    import { getParentCollectionById } from "../../../database";
    import { active_parent } from "../../active-parent-store";
    import { active_collection } from "../../active_collection_store";
    import type { ParentCollection } from "../../types";
    import SideBarItem from "./SideBarItem.svelte";


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
    .item {
        font-size: 20px;
        margin: 5px;
    }
    .item:hover {
        color: red;
    }
</style>
