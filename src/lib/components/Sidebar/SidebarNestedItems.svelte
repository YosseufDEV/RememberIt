<script lang="ts">
    import { get } from "svelte/store";

    import type { Collection } from "../../typescript/types";
    import { ALL_PARENTS_SLICE_DATABASE } from "$lib/typescript/Database/CachedDatabase";
    import { active_parent } from "../../stores/active-parent-store";
    import { active_collection } from "../../stores/active_collection_store";

    import SideBarItem from "./SideBarItem.svelte";

    async function handleClick(id: number) {
        const allParents = get(ALL_PARENTS_SLICE_DATABASE);
        const parent = allParents.find((p) => p.id == id);
        active_collection.set(parent)
        active_parent.set(parent)
    }

    export let collection: Collection;
</script>

<div>
    {#each collection.subCollections as nested_collection }
        <SideBarItem handleClick={() => handleClick(nested_collection.id)} collection={nested_collection} />
    {/each}
</div>

<style> 
</style>
