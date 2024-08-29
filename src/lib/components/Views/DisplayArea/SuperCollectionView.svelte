<script lang="ts">
    import type { Collection } from "../../../typescript/types";
    import QuestionsCollectionView from "./QuestionsCollectionView.svelte";

    export let superCollection: Collection;

    const isNested = superCollection.parentId != null;
</script>

<div>
    {#if isNested}
        <h1 class="nested-title">{superCollection.title}</h1>
    {/if}
    {#each superCollection.questionsCollections  as collection (collection.id)}
        <QuestionsCollectionView nestedRendering={true} questionsCollection={collection}/>
    {/each}
    {#each superCollection.subCollections as nestedCollection}
        <svelte:self superCollection={nestedCollection}/>
    {/each}
</div>

<style>
    .nested-title {
        font-weight: 500;
        font-size: 22px;
        margin-top: 35px;
    }
</style>
