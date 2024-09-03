<script lang="ts">
    import type { Collection } from "../../typescript/types";
    import { animateChevronClosed, animateChevronOpened, collapseCollection, expandCollection } from "../Animations/CollapseAndExpansionAnimations";
    import { active_parent } from "../../stores/active-parent-store";
    import SidebarNestedItems from "./SidebarNestedItems.svelte";
    import ChevronDown from "$lib/assets/icons/chevron_down.svelte";
    import EditableText from "$lib/GenericComponents/EditableText.svelte";
    import { updatesCollectionTitleById } from "../../../database";

    export let collection: Collection, handleClick: any;

    let children: HTMLElement,
        chevron: HTMLElement,
        collapsableCollection: HTMLElement;
    let activeAnimation: GSAPTween | GSAPTimeline;

    function getCollectionsLength(collection: Collection) {
        let length = 0;

        for(const childCollection of collection.questionsCollections) {
            length += childCollection.questions.length;
        }

        for(const nestedCollection of collection.subCollections) {
            length+=getCollectionsLength(nestedCollection);

        }
        return length;
    } 


    // Changable Flags
    $: hasNested = collection.subCollections.length > 0;
    let selected = false,
        collapsed=false;

    // Constant Flags
    const isNested = collection.parentId != null;

    let maxWidth: number = 0;

    function toggleCollection() {
        if(collapsed) {
            activeAnimation?.kill();
            activeAnimation = expandCollection(children, maxWidth);
            animateChevronOpened(chevron);
            collapsed = false;
        } else {
            activeAnimation?.kill();
            activeAnimation = collapseCollection(collapsableCollection, children, maxWidth)
            animateChevronClosed(chevron);
            collapsed = true;
        }
    }

    async function handleTitleUpdate(e: CustomEvent) {
        const newTitle = e.detail.newText;

        await updatesCollectionTitleById(collection.id, newTitle)
    }

    active_parent.subscribe(col => col && col.id == collection.id ? selected = true : selected = false);
    active_parent.subscribe(col => col && col.id == collection.id ? selected = true : selected = false);

</script>

<div bind:clientWidth={maxWidth} class="div-container"> 
    <div class="collection-container" 
         class:children-doesnt-have-nested={!hasNested && isNested} 
         class:has-nested-parents={hasNested}
         class:doesnt-have-nested-parents={!isNested && !hasNested}
         bind:this={collapsableCollection}>
        {#if hasNested}
            <div on:click={toggleCollection} class="chevron-container">
                <ChevronDown fill={"#505050"} size={23} bind:ref={chevron}/>
            </div>
        {/if}
        <div on:click={handleClick} class="container" >
            <!-- TODO: !! REMOVE THIS IN RELEASE !! -->
            <EditableText on:finishedEditing={handleTitleUpdate} class={ selected ? "selected item" : "item" } text={collection.title ? collection.title : "غير مسمى"}/>
            <!-- <p class="item" class:selected={selected}>{collection.title ? collection.title : "غير مسمى"}</p> -->
            <div class="collections-count-container">
                <p class="collections-count">{getCollectionsLength(collection)}</p>
            </div>
        </div>
    </div>
    <div class="children" bind:this={children}>
        <SidebarNestedItems collection={collection}/>
    </div>
</div>

<style> 
    .div-container {
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .container {
        overflow: hidden;
        display: grid;
        grid-template-columns: 1fr auto;
    }

    .has-nested-parents {
        grid-template-columns: auto 1fr auto !important;
    }

    .children-doesnt-have-nested {
        color: green;
        font-size: 95px;
        margin-left: 35px;
    }

    .doesnt-have-nested-parents {
        /* HACK: Hard codded value to make text align with ones that has an arrow*/
        margin-left: 34px;
    }

    .chevron-container {
        color: green !important;
    }

    .collection-container {
        overflow: hidden;
        display: grid;
        grid-column-gap: 10px;
        grid-template-columns: 1fr auto;
    }

    :global(.item) {
        font-size: 20px;
        width: fit-content;
    }

    :global(.item):hover {
        color: red;
    }

    :global(.selected) {
        color: indianred;
    }

    .children {
        position: relative;
        margin-left: 15px;
    }

    .collections-count-container {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .collections-count {
        font-size: 17px;
        color: grey;
    }
</style>
