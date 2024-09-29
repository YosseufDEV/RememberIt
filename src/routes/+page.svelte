<script lang="ts">
    import { onMount } from 'svelte'
    import { get } from "svelte/store"

    import StatusBar from '$lib/components/StatusBar.svelte';

    import '../app.css'
    import "fluent-svelte/theme.css";
    import DisplayArea from "$lib/components/DisplayArea.svelte";
    import QuestionsCollectionsSidebar from "$lib/components/Sidebar/QuestionsCollectionsSidebar.svelte"
    import CommandBar from "$lib/components/CommandBar.svelte";
    import CollectionsSidebar from '$lib/components/Sidebar/CollectionsSidebar.svelte';
    import { ContentDialog, Button } from "fluent-svelte";

    import { PARENTS_SLICE_DATABASE } from "$lib/typescript/Database/CachedDatabase"
    import { active_collection } from '$lib/stores/active_collection_store';
    import { active_parent } from '$lib/stores/active-parent-store';
    import { active_dialouge } from '$lib/stores/active-dialouge-store';
    import { open } from '@tauri-apps/plugin-dialog';
    import { readTextFile } from '@tauri-apps/plugin-fs';
    import { exportDatabaseAsJSON, importFromJson } from '../database';
    import type { Dialouge } from '$lib/typescript/types';

    let dialouge: Dialouge = {
        title: "This Shouldn't Appear",
        button: [],
        opened: false,
        callback: () => {
            active_dialouge.set(dialouge);
        }
    };

    async function selectFirstParent() {
        let firstParent = get(PARENTS_SLICE_DATABASE)[0];
        if(firstParent) {
            active_collection.set(firstParent);
        }
        active_parent.set(firstParent);
    }

    async function handleKeyDown(e: KeyboardEvent) {
        if (e.ctrlKey && e.key == "i") {
            const path = await open({
                filters: [{ name: "JSON", extensions: ['json']}]
            })
            const file = await readTextFile(path!);
            await importFromJson(JSON.parse(file));
        }
        if (e.ctrlKey && e.key == "e") {
            exportDatabaseAsJSON();
        }
    }

    onMount(async () => {
        await selectFirstParent();

        active_dialouge.subscribe((d) => {
            console.log("set");
            dialouge = d;
        })

    })
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="container">
    <ContentDialog bind:open={dialouge.opened} size="standard" title={dialouge.title}>
        {#if dialouge.content}
            {dialouge.content}
        {/if}
        <svelte:fragment slot="footer">
            {#each dialouge.button as button}
                <Button on:click={button.onClick} variant={button.variant}>{button.text}</Button>
            {/each}
        </svelte:fragment>
    </ContentDialog>
    <StatusBar />
    <CommandBar />
    <div class="main-view-container">
        <CollectionsSidebar />
        <QuestionsCollectionsSidebar />
        <DisplayArea />
    </div>
</div>

<style>
    .container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(200, 200, 200, 0);
        display: flex;
        flex-direction: column;
    }
    .main-view-container {
        width : 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
    }
</style>
