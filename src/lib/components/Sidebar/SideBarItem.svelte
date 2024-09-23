<script lang="ts">
    import { Menu, MenuItem, PredefinedMenuItem } from '@tauri-apps/api/menu';

    import { onMount } from 'svelte';
    import { get } from 'svelte/store';

    import type { Collection } from "../../typescript/types";
    import { ALL_PARENTS_SLICE_DATABASE, PARENTS_SLICE_DATABASE } from '$lib/typescript/Database/CachedDatabase';

    import { animateChevronClosed, animateChevronOpened, collapseCollection, deleteCollectionAnimation, expandCollection } from "../Animations/CollectionAnimations";
    import { active_parent } from "../../stores/active-parent-store";
    import { createCollection, deleteCollectionById, getUntitledCount, updatesCollectionTitleById } from "../../../database";
    import { active_collection } from '$lib/stores/active_collection_store';

    import ChevronDown from "$lib/assets/icons/chevron_down.svelte";
    import EditableText from "$lib/GenericComponents/EditableText.svelte";

    export let collection: Collection;
    let menu: Menu;

    let children: HTMLElement,
        chevron: HTMLElement,
        collapsableCollection: HTMLElement;
    let activeAnimation: GSAPTween | GSAPTimeline;
    let containerRef: HTMLElement;

    $: hasNested = collection.subCollections.length > 0;
    $: collectionLength = 0;

    // TODO: IMplement Subscribr!

    let allParents = $ALL_PARENTS_SLICE_DATABASE;

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

    let selected = false,
        collapsed=true;

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

    function addCollectionIfSuperParent(root: Collection, collectionId: number, collectionToAdd: Collection) {
        if(root.id == collectionId) {
            root.subCollections.push(collectionToAdd);
        } else {
            for(const subCollection of root.subCollections) {
                addCollectionIfSuperParent(subCollection, collectionId, collectionToAdd); 
            }
        }
    }

    async function addSubCollection() {
        let parents = get(PARENTS_SLICE_DATABASE);
        const index = parents.findIndex((pCol) => pCol.id == collection.id);

        let subCollection = await createCollection(`Untitled ${await getUntitledCount()+1}`, collection.id);

        subCollection.questionsCollections = []
        subCollection.subCollections = []

        if(index != -1) {
            const oldDB = parents; 
            oldDB[index].subCollections.push(subCollection);
            PARENTS_SLICE_DATABASE.set(oldDB);
        } else {
            for(const superCollection of parents) {
                addCollectionIfSuperParent(superCollection, collection.id, subCollection);
            }
            PARENTS_SLICE_DATABASE.set(parents);
        }
    }

    async function showContextMenu() {
        const menuItems = await Promise.all([
            MenuItem.new({
                text: 'Create Subcollection',
                action: addSubCollection
            }),
            PredefinedMenuItem.new({ item: 'Separator' }),
            MenuItem.new({
                text: 'Delete Collection',
                action: deleteCollection
            }),
        ])

        menu = await Menu.new({
            items: menuItems
        })

        await menu.popup()
    }

    async function handleParnetClick() {
        console.log(collection.id);
        const parent = allParents.find(p => p.id == collection.id)
        active_collection.set(parent)
        active_parent.set(parent)
    }

    function deleteCollection() {
        deleteCollectionAnimation(containerRef).then(async () => {
                await deleteCollectionById(collection.id); 
        })
    }

    onMount(async () => {
        active_collection.subscribe((col) => {
            if(col && col.id == collection.id) {
                collectionLength = getCollectionsLength(collection);
            }
        })

        active_parent.subscribe((col) => {
            if(col && col.id == collection.id) {
                selected = true;
            } else {
                selected = false;
            }
        });

        collectionLength = getCollectionsLength(collection);

        //
    })

</script>

<div bind:clientWidth={maxWidth} bind:this={containerRef} class="div-container"> 
    <div class="collection-container" 
         on:contextmenu={showContextMenu}
         class:children-doesnt-have-nested={!hasNested && isNested} 
         class:has-nested-parents={hasNested}
         class:doesnt-have-nested-parents={!isNested && !hasNested}
         bind:this={collapsableCollection}>
        {#if hasNested}
            <div on:click={toggleCollection} class="chevron-container">
                <ChevronDown fill={"#505050"} size={23} bind:ref={chevron}/>
            </div>
        {/if}
        <div on:click={handleParnetClick} class="container" >
            <!-- TODO: !! REMOVE THIS IN RELEASE !! -->
            <EditableText on:finishedEditing={handleTitleUpdate} class={ selected ? "selected item" : "item" } text={collection.title ? collection.title : "غير مسمى"}/>
            <!-- <p class="item" class:selected={selected}>{collection.title ? collection.title : "غير مسمى"}</p> -->
            <div class="collections-count-container">
                <p class="collections-count">{collectionLength}</p>
            </div>
        </div>
    </div>
    <div class="children" bind:this={children}>
        {#each collection.subCollections as nested_collection }
            <svelte:self collection={nested_collection} />
        {/each}
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
        position: absolute;
        top: -1000px;
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
