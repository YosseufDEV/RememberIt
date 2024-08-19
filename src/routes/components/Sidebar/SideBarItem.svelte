<script lang="ts">
    import { animateChevronClosed, animateChevronOpened, collapseCollection, expandCollection } from "../Animations/CollapseAndExpansionAnimations";
    import { active_parent } from "../../stores/active-parent-store";
    import type { ParentCollection } from "../../typescript/types";
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

    // TODO: Optimize this function as it checks for the variable n times every time an element is clicked
    active_parent.subscribe(col => {
        if(col && col.id == collection.id) {
            selected = true;
        } else {
            selected = false;
        }
    })

</script>

<div bind:clientWidth={maxWidth} class="main-container"> 
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
            <p class="collections-count">{getCollectionsLength(collection)}</p>
        </div>
    </div>
    <div class="children" bind:this={children}>
        <SidebarNestedItems collection={collection}/>
    </div>
</div>
<style> 
    .main-container {
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
        width: 100%;
        display: grid;
        grid-column-gap: 10px;
        grid-template-columns: 1fr auto;
    }
    .collection-container p {
        background: inherit;
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

    .collections-count {
        margin-left: 15px;
        font-weight: 500;
        color: grey;
    }
</style>
