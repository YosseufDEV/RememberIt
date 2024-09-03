<script lang="ts">
    import Seperator from "$lib/GenericComponents/Seperator.svelte";
    import type { Collection } from "../../typescript/types";
    import ChildrenSidebarItem from "../Sidebar/ChildrenSidebarItem.svelte";

    export let collection: Collection, parentsTitleArray: string[] = [];
</script>

<div class="container">
    {#each collection.subCollections  as nested_collection (nested_collection.id)}
        <div class="container">
            <div class="title-container">
                {#if nested_collection.questionsCollections.length > 0}
                    <h2 class="collection-title">{nested_collection.title}</h2>
                    {#each parentsTitleArray as title}
                        <h4 class="parent-title">{title}</h4>   
                        {#if title != parentsTitleArray[parentsTitleArray.length-1]}
                            <p style="margin-left: 5px;">
                            &raquo;
                            </p>
                        {/if}
                    {/each}
                {/if}
            </div>
            {#each nested_collection.questionsCollections  as child_collection (child_collection.id)}
                <ChildrenSidebarItem collection={child_collection}/>
            {/each}
        </div>
        <svelte:self collection={nested_collection} parentsTitleArray={[nested_collection.title, ...parentsTitleArray, ]}/>
    {/each}
</div>

<style>
    .title-container {
        display: flex;
        margin: 10px 20px;
        flex-direction: row;
        align-items: center;
    }

    .collection-title {
        font-size: 22px;
        font-weight: 500;
        font-weight: bold;
    }
    .parent-title {
        font-weight: bold;
        margin: 0;
        direction: rtl;
        color: darkgrey;
        margin-left: 10px;
    }
</style>
