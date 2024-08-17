<script lang="ts">
    import type { ParentCollection } from "../../types";
    import SidebarNestedItems from "./SidebarNestedItems.svelte";



    export let collection: ParentCollection, handleClick: any;

    function getCollectionsLength(collection: ParentCollection) {
        let length = 0;

        if(!collection) {
            return 0;
        }

        length += collection.child_collections.length;

        for(const nestedCollection of collection.nested_parent_collections) {
            length+=getCollectionsLength(nestedCollection);

        }
        return length;
    }
</script>

<div class="main-container"> 
    <div class="collection-container">
        <!-- {#if collection.nested_parent_collections.length > 0} -->
        <!--     <div> -->
        <!--         > -->
        <!--     </div> -->
        <!-- {/if} -->
        <div on:click={handleClick} class="container" >
            <p class="item">{collection.title}</p>
            <p class="collections-count">{getCollectionsLength(collection)}</p>
        </div>
    </div>
    <div class="children">
    <SidebarNestedItems collection={collection}/>
    </div>
</div> <style> 
    .main-container {
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    .container {
        overflow: hidden;
        display: flex;
    }
    .collection-container {
        display: flex;
    }
    .item {
        font-size: 20px;
    }
    .item:hover {
        color: red;
    }
    .children {
        position: relative;
        margin-left: 25px;
    }
    .collections-count {
        margin-left: 15px;
        color: #0efeaa;
    }
</style>
