<script lang="ts">  
    import { onMount } from "svelte";

    import { type QuestionsCollection, type Collection, type Question, DraggableItemType, type TagItemMetadata } from "../typescript/types"
    import { active_collection } from "../stores/active_collection_store";
    import { colorOverlayAnimation, entranceAnimation, exitingAnimation } from "./Animations/DisplayAreaAnimations";
    import SuperCollectionView from "../Views/DisplayArea/SuperCollectionView.svelte";
    import QuestionsCollectionView from "../Views/DisplayArea/QuestionsCollectionView.svelte";
    import DropZone from "./DragAndDrop/DropZone.svelte";
    import FilterRuleTag from "./FilterRules/FilterRuleTag.svelte";

    $: activeCollection = null as (null | (Collection | QuestionsCollection))
    let unfilteredCollecition: (Collection | QuestionsCollection);

    let mainContainerRef: HTMLElement,
        displayContainerRef: HTMLElement,
        hoverDivRef: HTMLElement;
    let hoverAnimation: GSAPTimeline;

    // FIX: Filter Rules migrate on collection change!
    let filterRules = [] as TagItemMetadata[];

    function handleDraggableDrop(e: CustomEvent) {
        let item = e.detail.item;
        if(item.type == DraggableItemType.TAG) {
            handleHoverLeave(e);
            filterRules = [...filterRules, item];
            filterCollection([item.id]);
        }

    }

    function handleRuleRemove(rule: TagItemMetadata) {
        if(!unfilteredCollecition) return;

        filterRules = filterRules.filter((r) => r.id != rule.id);
        
        if(filterRules.length == 0) {
            exitingAnimation(displayContainerRef, () => {
                entranceAnimation(displayContainerRef)
                activeCollection = structuredClone(unfilteredCollecition);
            })
        } else {
            let flatRules = filterRules.map((el) => el.id);
            filterCollection(flatRules, unfilteredCollecition);
        }


    }

    function handleHoverEnter(e: CustomEvent) {
        let item = e.detail.item;
        if(item.type == DraggableItemType.TAG) {
            hoverAnimation = colorOverlayAnimation(hoverDivRef, item.color, 0.20);
        }
    }

    function handleHoverLeave(e: CustomEvent) {
        let item = e.detail.item;
        if(item.type == DraggableItemType.TAG) {
            hoverAnimation.reverse();
        }
    }

    function getFilteredQuestions(col: QuestionsCollection, reasonId: number[]) {
        let questions = col.questions 
        let hasTags = (q: Question) => reasonId.every(id => 
            q.tags.some(tag => tag.id === id)
        );
        return questions.filter((q) => hasTags(q));
    }

    function isCollection(activeCollection: Collection | QuestionsCollection): activeCollection is Collection {
        return (activeCollection as Collection).subCollections != null;
    }
    
    // TODO: Intorduce FilterRules
    function filterCollection(reasonId: number[], startingCollection?: Collection | QuestionsCollection) {
        const collection = startingCollection ? structuredClone(startingCollection) : activeCollection;

        setTimeout(() => {
            if(!collection) return;

            if(isCollection(collection)) {
                exitingAnimation(displayContainerRef, () => {
                    entranceAnimation(displayContainerRef)
                    const filteredSubCollections = [];

                    for(const subCollection of (<Collection>collection).subCollections) {
                        subCollection.questionsCollections = filterSuperCollectionQuestions(subCollection, reasonId);
                        filteredSubCollections.push(subCollection);
                    }

                    (<Collection>collection).subCollections = filteredSubCollections;
                    (<Collection>collection).questionsCollections = filterSuperCollectionQuestions(collection as Collection, reasonId);
                    activeCollection = collection;
                })
            }
            if(!isCollection(collection)) {
                let questions = getFilteredQuestions(collection, reasonId); 
                exitingAnimation(displayContainerRef, () => {
                    (<QuestionsCollection>collection).questions = questions;
                    activeCollection = collection;
                    entranceAnimation(displayContainerRef)
                })

            }
        }, 200)
        return collection;
    }

    function filterSuperCollectionQuestions(collection: Collection, reasonId: number[]) {
        const filteredQuestionsCollection = [];

        for(const questionsCollection of collection.questionsCollections) {
            const filteredQuestions = getFilteredQuestions(questionsCollection, reasonId);
            questionsCollection.questions = filteredQuestions;
            filteredQuestionsCollection.push(questionsCollection);
        }

        // INFO: SOLVED By Mistake LMFAO
        for(const subCollection of collection.subCollections) {
            subCollection.questionsCollections = filterSuperCollectionQuestions(subCollection, reasonId);
        }

        return filteredQuestionsCollection;
    }

    onMount(() => {
        entranceAnimation(displayContainerRef);

        active_collection.subscribe((collection) => {
            setTimeout(() => {
                    exitingAnimation(displayContainerRef, () => {
                        entranceAnimation(displayContainerRef)
                        activeCollection = collection
                        filterRules = [];
                        unfilteredCollecition = structuredClone(collection);
                    })
            }, 200)
        });

    })

    // TODO: Implement Smooth scrolling, max-scroll
    function handleMouseWheel(e: WheelEvent) {
        e.preventDefault(); // Prevent default scroll behavior
        const elRect = displayContainerRef.getBoundingClientRect();
        // Calculate the current Y offset
        let currentY = elRect.top;

        // Determine the new Y position
        let newY = currentY - e.deltaY;

        if(newY >= 0) {
            newY = 0;
        }

        displayContainerRef.style.transform = `translateY(${newY}px)`;
    }

</script>

<div class="main-container" on:mousewheel={handleMouseWheel} bind:this={mainContainerRef}>
    <div bind:this={hoverDivRef} class="hover-div"/>
    <DropZone on:drop={handleDraggableDrop} on:hoverenter={handleHoverEnter} on:hoverleave={handleHoverLeave} >
        <div class="container" bind:this={displayContainerRef}>
            {#if activeCollection}
                <div class="title-container">
                    <h1 class="parent-title">{activeCollection.title}</h1>
                    <div class="filters-row">
                        {#each filterRules as filterRule}
                            <FilterRuleTag tag={filterRule} on:removeFilter={(e) => handleRuleRemove(e.detail.tag)} />
                        {/each}
                    </div>
                </div>
                {#if 'questions' in activeCollection}
                    <QuestionsCollectionView questionsCollection={activeCollection} />
                    {:else if activeCollection.id > 0}
                    <SuperCollectionView superCollection={activeCollection} parentFontSize={27}/>
                {/if}
            {/if}
        </div>
    </DropZone>
</div>

<style>
    .main-container {
        position: relative;
        z-index: 100;
        background: rgba(0, 0, 0, 0.7);
        width: 100%;
        padding-top: 40px;
        padding-bottom: 10px;
        padding-left: 25px;
    }
    .container {
        /* HACK: to make the badge explanation appear even in overflow */
        width: calc(100% - 5px);
        height: 100%;
    }
    .hover-div {
        position: absolute;
        margin-top: -40px;
        margin-left: -25px;
        margin-bottom: -10px;
        /* z-index: 100; */
        width: 100%;
        height: 100%;
    }
    .parent-title {
        font-weight: 500;
        font-size: 32px;
    }

    .title-container {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .filters-row {
        display: flex;
        align-items: center;
        margin-left: 15px; 
    }

</style>
