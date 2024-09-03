<script lang="ts">
    import Tags from "$lib/assets/icons/Tags.svelte";
import { TAGS_SLICE_DATABASE } from "../../../typescript/Database/CachedDatabase";
    import type { Tag } from "../../../typescript/types"
    import TagSidebarItem from "../../Sidebar/TagSidebarItem.svelte";

    let reasons: Tag[] = [];

    TAGS_SLICE_DATABASE.subscribe((db) => {
        reasons = db;
    })

</script>

<div class="tag-view-container">
    <div class="tags-icon-container">
        <Tags size={28}/>
        <p class="tags-text">Tags</p>
    </div>
    <div class="tags-container">
        {#each reasons as reason}
            <svelte:component this={TagSidebarItem} tag={reason}/>
        {/each}
    </div>
</div>

<style>
    .tag-view-container {
        display: flex;
        flex-direction: column;
        z-index: 100;
    }

    .tags-icon-container {
        display: flex;
        align-items: center;
        justify-content: left;
        margin-top: 15px;
        margin-bottom: 10px;
    }
    .tags-icon-container p {
        margin-left: 10px;
        font-size: 22px;
    }
    
    .tags-container {
        margin-left: 25px;
    }
</style>
