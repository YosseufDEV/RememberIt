<script lang="ts">
    import { ALL_PARENTS_SLICE_DATABASE, DATABASE, PARENTS_SLICE_DATABASE } from "../../typescript/Database/CachedDatabase";
    import { createCollection, getUntitledCount } from "../../../database"

    import Header from "$lib/GenericComponents/Header.svelte";

    import TagsView from "../../Views/ParentSidebar/TagsView.svelte";
    import SideBarItem from "./SideBarItem.svelte";
    import Notebook from "$lib/assets/icons/Notebook.svelte";
    import AddCollectionForm from "../Forms/AddCollectionForm.svelte";
    import QuestionTypesView from "$lib/Views/ParentSidebar/QuestionTypesView.svelte";

    let parentCollections = $PARENTS_SLICE_DATABASE;
    let allParents = $ALL_PARENTS_SLICE_DATABASE;

    async function handleCollectionCreate() {
        let c = await createCollection(`Untitled ${await getUntitledCount()+1}`);
        c.questionsCollections = [];
        c.subCollections = [];

        let oldDB = $DATABASE;

        oldDB.unnested.push(c);
        oldDB.parents.push(c);

        DATABASE.set(oldDB);
    }

    PARENTS_SLICE_DATABASE.subscribe((pCol) => {
        parentCollections = pCol;
    })

    ALL_PARENTS_SLICE_DATABASE.subscribe((aPCol) => {
        allParents = aPCol;
    })

</script>

<div class="main-container">
    <div class="container">
        <Header handleAddClick={handleCollectionCreate} Icon={Notebook} text="Questions"/>
        <div class="collections-container">
            {#each parentCollections as collection (collection.id)}
                <SideBarItem collection={collection} />
            {/each}
        </div>
        <AddCollectionForm />
        <TagsView />
        <QuestionTypesView />
    </div>
</div>

<style>
    .main-container {
        background: rgba(0, 0, 0, 0.8);
        height: 100%;
        padding: 40px 5px;
        padding-top: 0;
        min-width: 21%;
        display: flex; 
        flex-direction: column;
    }
    
    .container {
        z-index: 11;
        padding: 40px 5px;
        overflow-y: scroll;
    }

    .collections-container {
        margin-left: 15px;
        margin-bottom: 20px;
    }
</style>
