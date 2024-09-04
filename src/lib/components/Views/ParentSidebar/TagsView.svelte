<script lang="ts">
    import { get } from "svelte/store";
    import colors from "$lib/assets/colors/colors.json";

    import AddCirlceIcon from "$lib/assets/icons/AddCirlceIcon.svelte";
    import Tags from "$lib/assets/icons/Tags.svelte";
    import { DATABASE, TAGS_SLICE_DATABASE } from "../../../typescript/Database/CachedDatabase";
    import type { Tag } from "../../../typescript/types"
    import TagSidebarItem from "../../Sidebar/TagSidebarItem.svelte";
    import { insertTag } from "../../../../database";
    import { generateColor } from "$lib/typescript/color_generator";

    let reasons: Tag[] = [];

    TAGS_SLICE_DATABASE.subscribe((db) => {
        reasons = db;
    })

    function addLabel() {
        let oldDB = get(DATABASE);

        insertTag("Untitled Label", generateColor(colors)).then((tag) => {
            oldDB.tags.push({ id: tag.id, label: tag.label, color: tag.color })
            DATABASE.set(oldDB);
            TAGS_SLICE_DATABASE.set(oldDB.tags)
        });
    }

</script>

<div class="tag-view-container">
    <div class="tags-icon-container">
        <div class='icon-container'>
            <Tags size={28}/>
            <p class="tags-text">Tags</p>
        </div>
        <AddCirlceIcon size={30} handleClick={addLabel}/>
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
        display: grid;
        margin-top: 15px;
        margin-bottom: 10px;
        grid-template-columns: 1fr auto;
    }
    .icon-container {
        display: flex;
        align-items: center;
        justify-content: left;
    }
    .tags-icon-container p {
        margin-left: 10px;
        font-size: 22px;
    }
    
    .tags-container {
        margin-left: 25px;
    }
</style>
