<script lang="ts">
    import { DATABASE } from "../../database";
    import AddCollectionForm from "./AddCollectionForm.svelte";
    import SideBarItem from "./SideBarItem.svelte";
    import { invoke } from "@tauri-apps/api/core";

    $: collections = [] as { id: number, title: string }[];

    async function handleCollectionSubmit(e: CustomEvent) {
        await invoke("create_collection", { title: e.detail.title })
        fetchCollections();

    }

    async function fetchCollections() {
        collections = await invoke("get_collections_titles");
    }


</script>

<div class="container">
    {#await fetchCollections() } {/await}
    {#each collections as collection (collection.id)}
        <SideBarItem id={collection.id} name={collection.title} />
    {/each}
    <AddCollectionForm on:addCollection={handleCollectionSubmit} />
</div>

<style>
    .container {
        background: white;
        width: 25%;
        height: 100%;
        display: flex; 
        flex-direction: column;
        align-items: right;
    }
</style>
