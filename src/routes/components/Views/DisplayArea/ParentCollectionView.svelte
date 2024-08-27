<script lang="ts">
    import type { ParentCollection } from "../../../typescript/types";
    import DropZone from "../../DragAndDrop/DropZone.svelte";
    import ChildCollectionView from "./ChildCollectionView.svelte";

    export let parentCollection: ParentCollection;

    const isNestedParent = parentCollection.parent_id != null;
</script>

<div>
    <h1 class:nested-title={isNestedParent}
        class="parent-title">{parentCollection.title}</h1>
    {#each parentCollection.child_collections  as collection (collection.id)}
        <ChildCollectionView nestedRendering={true} childCollection={collection}/>
    {/each}
    {#each parentCollection.nested_parent_collections as nestedCollection}
        <svelte:self parentCollection={nestedCollection}/>
    {/each}
</div>

<style>
    .parent-title {
        font-weight: 500;
        font-size: 32px;
        margin-bottom: 20px;
    }
    .nested-title {
        font-weight: 500;
        font-size: 22px;
        margin-top: 35px;
    }
</style>
