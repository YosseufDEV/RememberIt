<script lang="ts">
    import type { ParentCollection } from "../../types";
    import Question from "../Question.svelte";
    import ChildCollectionView from "./ChildCollectionView.svelte";
    import NestedChildCollectionView from "./NestedChildCollectionView.svelte";

    export let parentCollection: ParentCollection;
</script>

<div>
    <h1>{parentCollection.title}</h1>
    {#each parentCollection.child_collections  as collection (collection.id)}
        <ChildCollectionView childCollection={collection}/>
    {/each}
    {#each parentCollection.nested_parent_collections as nestedCollection}
        <!-- <NestedChildCollectionView nestedCollection={nestedCollection}/> -->
    {/each}
    <!-- <AddQuestionForm on:addQuestion={addQuestionToCurrentCollection}/> -->
</div>
