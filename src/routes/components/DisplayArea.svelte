<script lang="ts">  
    import { onMount } from "svelte";

    import { type QuestionsCollection, type Collection, type Question, CollectionType } from "../typescript/types"
    import { active_collection } from "../stores/active_collection_store";
    import { colorOverlayAnimation, entranceAnimation, exitingAnimation } from "./Animations/DisplayAreaAnimations";
    import SuperCollectionView from "./Views/DisplayArea/SuperCollectionView.svelte";
    import QuestionsCollectionView from "./Views/DisplayArea/QuestionsCollectionView.svelte";
    import DropZone from "./DragAndDrop/DropZone.svelte";

    $: activeCollection = null as (null | (Collection | QuestionsCollection))
    let mainContainerRef: HTMLElement,
        displayContainerRef: HTMLElement,
        hoverDivRef: HTMLElement;
    let hoverAnimation: GSAPTimeline;

    function handleDraggableDrop(e: CustomEvent) {
        let item = e.detail.item;

        filterCollection(item.id);
        handleHoverLeave();
    }

    function handleHoverEnter(e: CustomEvent) {
        let item = e.detail.item;
        hoverAnimation = colorOverlayAnimation(hoverDivRef, item.color, 0.20);
    }

    function handleHoverLeave() {
        hoverAnimation.reverse();
    }

    function getFilteredQuestions(col: QuestionsCollection, reasonId: number) {
        let questions = col.questions 
        let hasTags = (q: Question) => q.tags.filter((r) => r.id == reasonId).length > 0
        return questions.filter((q) => hasTags(q));
    }

    function isCollection(activeCollection: Collection | QuestionsCollection): activeCollection is Collection {
        return (activeCollection as Collection).subCollections != null;
    }
    
    // TODO: Intorduce FilterRules
    function filterCollection(reasonId: number) {
        setTimeout(() => {
            if(!activeCollection) return;

            if(isCollection(activeCollection)) {
                exitingAnimation(displayContainerRef, () => {
                    entranceAnimation(displayContainerRef)
                    const filteredSubCollections = [];

                    for(const subCollection of (<Collection>activeCollection).subCollections) {
                        console.log(activeCollection);
                        console.log(subCollection);
                        subCollection.questionsCollections = filterSuperCollectionQuestions(subCollection, reasonId);
                        filteredSubCollections.push(subCollection);
                    }

                    (<Collection>activeCollection).subCollections = filteredSubCollections;
                    (<Collection>activeCollection).questionsCollections = filterSuperCollectionQuestions(activeCollection as Collection, reasonId);

                })
            }
            if(!isCollection(activeCollection)) {
                let questions = getFilteredQuestions(activeCollection, reasonId); 
                exitingAnimation(displayContainerRef, () => {
                    (<QuestionsCollection>activeCollection).questions = questions;
                    entranceAnimation(displayContainerRef)
                })

            }
        }, 200)
    }

    function filterSuperCollectionQuestions(collection: Collection, reasonId: number) {
        console.log(collection);
        const filteredQuestionsCollection = [];
        for(const questionsCollection of collection.questionsCollections) {
            const filteredQuestions = getFilteredQuestions(questionsCollection, reasonId);
            questionsCollection.questions = filteredQuestions;
            filteredQuestionsCollection.push(questionsCollection);
        }
        return filteredQuestionsCollection;
    }

    active_collection.subscribe((collection) => {
        setTimeout(() => {
                exitingAnimation(displayContainerRef, () => {
                    entranceAnimation(displayContainerRef)
                    activeCollection = collection

                })
        }, 200)
    });

    onMount(() => {
        console.log("Mounted")
        entranceAnimation(displayContainerRef);
    })

</script>

<div class="main-container" bind:this={mainContainerRef}>
    <div bind:this={hoverDivRef} class="hover-div"/>
    <DropZone on:drop={handleDraggableDrop} on:hoverenter={handleHoverEnter} on:hoverleave={handleHoverLeave} >
        <div class="container" bind:this={displayContainerRef}>
            {#if activeCollection && 'questions' in activeCollection}
                <QuestionsCollectionView questionsCollection={activeCollection} />
            {:else if activeCollection && activeCollection.id > 0}
                <SuperCollectionView superCollection={activeCollection}/>
            {/if}
        </div>
    </DropZone>
</div>

<style>
    .main-container {
        background: rgba(0, 0, 0, 0.7);
        width: 100%;
        padding-top: 40px;
        padding-bottom: 10px;
        padding-left: 25px;
    }
    .container {
        overflow-y: scroll;
        width: calc(100% - 5px);
        height: 100%;
    }
    .hover-div {
        position: absolute;
        margin-top: -40px;
        margin-left: -25px;
        margin-bottom: -10px;
        width: 100%;
        height: 100%;
    }
</style>
