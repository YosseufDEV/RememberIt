<script lang="ts">
    import type { MouseEventHandler } from "svelte/elements";
    import type { ParentCollection } from "../../types";
    import SidebarNestedItems from "./SidebarNestedItems.svelte";


    export let collection: ParentCollection, handleClick: any, margin=12;
</script>

<div style={`margin-left: ${margin}px;'`}> 
    <p on:click={handleClick} class="item">{collection.title}</p>
    <SidebarNestedItems collection={collection}/>
</div>

<style> 
    .item {
        font-size: 20px;
    }
    .item:hover {
        color: red;
    }
</style>
