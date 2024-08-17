<script lang="ts">
    import SidebarNestedItems from "./SidebarNestedItems.svelte";
    import chevron_down from "$lib/assets/chevron_down.svg"
    import { active_parent } from "../../active-parent-store";
    import type { ParentCollection } from "../../types";
    import gsap from "gsap";


    export let collection: ParentCollection, handleClick: any;
    let children: HTMLElement;

    // Flags
    let selected = false, 
        hasNestedParents = collection.nested_parent_collections.length > 0,
        collapsed=false,
        activeAnimation: TweenMax | TimelineMax | null =null;
    let maxWidth: number = 0;
    let chevron: HTMLImageElement | null = null;

    function getCollectionsLength(collection: ParentCollection) {
        let length = 0;

        if(!collection) {
            return 0;
        }

        for(const childCollection of collection.child_collections) {
            length += childCollection.questions.length;
        }

        for(const nestedCollection of collection.nested_parent_collections) {
            length+=getCollectionsLength(nestedCollection);

        }
        return length;
    } 

    const ANIMATION_DURATION = 0.2;

    function animateChevronOpened() {
        gsap.to(chevron, {
            rotate: "0",
            duration: ANIMATION_DURATION
        })
    }

    function animateChevronClosed() {
        gsap.to(chevron, {
            rotate: "-90",
            duration: ANIMATION_DURATION
        })
    }

    function expandCollection() {
        activeAnimation = gsap.fromTo(children, 
                { top: `-${maxWidth}px`, opacity: 0, duration: ANIMATION_DURATION, delay: 0,},
                { top: "0px", 
                  opacity: 1, 
                  position: "relative", 
                  duration: ANIMATION_DURATION, 
                  delay: 0,
                  ease: "power2.out"
                }
            )
    }

    function collapseCollection() {
        let timeline = gsap.timeline();
        activeAnimation = timeline;
            timeline.
                to(children, 
                    { 
                        top: `-${maxWidth}px`, 
                        duration: ANIMATION_DURATION, 
                        ease: "power2.in",
                        opacity: 0 
                    })
                .to(children, { position: "absolute" })
    }

    function toggleCollection() {
        if(collapsed) {
            activeAnimation?.kill();
            expandCollection();
            animateChevronOpened();
            collapsed = false;
        } else {
            activeAnimation?.kill();
            collapseCollection()
            animateChevronClosed();
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
    <div class="collection-container" class:has-nested-parents={hasNestedParents}>
        {#if hasNestedParents}
            <div on:click={toggleCollection}>
                <!--TODO: Replace This-->
                <img bind:this={chevron} src={chevron_down}/>
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
        width: 100%;
        overflow: hidden;
        display: grid;
        grid-template-columns: 1fr auto;
    }

    /* ISSUE: Nested Element is actually showing before its parent (margin not working right)*/
    .has-nested-parents {
        grid-template-columns: auto 1fr auto !important;
    }
    .collection-container {
        background: initial;
        overflow: hidden;
        width: 100%;
        display: grid;
        z-index: 500;
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
        color: salmon;
    }
    .children {
        z-index: 0;
        position: relative;
        margin-left: 25px;
    }
    .collections-count {
        margin-left: 15px;
        color: grey;
    }
</style>
