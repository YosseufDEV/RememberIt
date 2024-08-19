<script lang="ts">
import Question from "../Question.svelte";
    import type { ParentCollection } from "../../typescript/types";
    import ChildCollectionView from "./ChildCollectionView.svelte";

    export let nestedCollection: ParentCollection;
    console.log(nestedCollection);
</script>

<div>
    {#each  nestedCollection.child_collections as childCollection }
        <h3>{childCollection.title}</h3>
        <ChildCollectionView childCollection={childCollection}/>
        {#each nestedCollection.nested_parent_collections as nestedParentCollection}
            <!-- TODO: FIX THIS SHIT!!!! --> 
            <!-- <svelte:self nestedCollcetion={nestedParentCollection}/> -->
        {/each}
    {/each}
</div>
