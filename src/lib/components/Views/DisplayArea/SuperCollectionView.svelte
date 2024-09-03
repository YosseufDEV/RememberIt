<script lang="ts">
    import type { Collection } from "../../../typescript/types";
    import QuestionsCollectionView from "./QuestionsCollectionView.svelte";

    export let superCollection: Collection, parentFontSize;

    const isNested = superCollection.parentId != null;
</script>

<div>
    {#if isNested}
        <h1 class="nested-title" style:font-size={`${parentFontSize}px`}>{superCollection.title}</h1>
    {/if}
    {#each superCollection.questionsCollections  as collection (collection.id)}
        <QuestionsCollectionView nestedRendering={true} questionsCollection={collection}/>
    {/each}
    {#each superCollection.subCollections as nestedCollection}
        <svelte:self superCollection={nestedCollection} parentFontSize={parentFontSize-4}/>
    {/each}
</div>

<style>
    .nested-title {
        margin-top: 35px;
        margin-bottom: 15px;
    }
</style>
