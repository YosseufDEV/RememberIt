<script lang="ts">
    import type { ParentCollection } from "../../typescript/types";
    import { animateChevronClosed, animateChevronOpened, collapseCollection, expandCollection } from "../Animations/CollapseAndExpansionAnimations";
    import { active_parent } from "../../stores/active-parent-store";
    import SidebarNestedItems from "./SidebarNestedItems.svelte";
    import ChevronDown from "$lib/assets/icons/chevron_down.svelte";

    export let collection: ParentCollection, handleClick: any;

    let children: HTMLElement;
    let chevron: HTMLElement | null = null;
    let collapsableParent: HTMLElement | null = null;
    let activeAnimation: GSAPTween | GSAPTimeline | null = null;

    function getCollectionsLength(collection: ParentCollection) {
        let length = 0;

        for(const childCollection of collection.child_collections) {
            length += childCollection.questions.length;
        }

        for(const nestedCollection of collection.nested_parent_collections) {
            length+=getCollectionsLength(nestedCollection);

        }
        return length;
    } 

    // Changable Flags
    let selected = false,
        collapsed=false;

    // Constant Flags
    const hasNestedParents = collection.nested_parent_collections.length > 0,
          isNested = collection.parent_id == null;

    let maxWidth: number = 0;

    function toggleCollection() {
        if(collapsed && chevron) {
            activeAnimation?.kill();
            activeAnimation = expandCollection(children, maxWidth);
            animateChevronOpened(chevron);
            collapsed = false;
        } else if(!collapsed && chevron && collapsableParent) {
            activeAnimation?.kill();
            activeAnimation = collapseCollection(collapsableParent, children, maxWidth)
            animateChevronClosed(chevron);
            collapsed = true;
        }
    }

    active_parent.subscribe(col => col && col.id == collection.id ? selected = true : selected = false);

</script>

<div bind:clientWidth={maxWidth} class="div-container"> 
    <div class="collection-container" 
         class:children-doesnt-have-nested={!hasNestedParents && !isNested} 
         class:has-nested-parents={hasNestedParents}
         bind:this={collapsableParent}>
        {#if hasNestedParents}
            <div on:click={toggleCollection} class="chevron-container">
                <ChevronDown fill={"#505050"} size={23} bind:ref={chevron}/>
            </div>
        {/if}
        <div on:click={handleClick} class="container" >
            <p class="item" class:selected={selected}>{collection.title}</p>
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

    .chevron-container {
        color: green !important;
    }

    .collection-container {
        overflow: hidden;
        display: grid;
        grid-column-gap: 10px;
        grid-template-columns: 1fr auto;
    }

    .item {
        font-size: 20px;
    }

    .item:hover {
        color: red;
    }

    .selected {
        color: indianred;
    }

    .children {
        z-index: 0;
        position: relative;
        margin-left: 15px;
    }

    .collections-count-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .collections-count {
        font-weight: 600;
        color: grey;
    }
</style>
