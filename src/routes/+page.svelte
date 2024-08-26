<script lang="ts">
    import { onMount } from 'svelte'

    import '../app.css'
    import { active_collection } from './stores/active_collection_store';
    import { active_parent } from './stores/active-parent-store';
    import { getParentCollectionById } from '../database';
    import DisplayArea from "./components/DisplayArea.svelte";
    import ParentsSidebar from "./components/Sidebar/ParentsSidebar.svelte"
    import ChildrenSidebar from "./components/Sidebar/ChildrenSidebar.svelte"
    import CommandBar from "./components/CommandBar.svelte";
    import StatusBar from './components/StatusBar.svelte';
    import "fluent-svelte/theme.css";
    
    let reasons;
    $: isCommandBarVisible = false;
    let modifierKeys = [],
        primaryKeys = []; 

    async function selectFirstParent() {
        // let firstParent = await getParentCollectionById(1);
        // active_collection.set(firstParent);
        // active_parent.set(firstParent);
    }

    onMount(async () => {
        await selectFirstParent();
    })

    // TODO: Make the shortcuts more dynamic!
    function handleKeyDown(e: KeyboardEvent) {
        if (e.ctrlKey && e.keyCode == 84) { //CTRL+ALT+F4
            isCommandBarVisible = !isCommandBarVisible;
        }
    }

</script>

<svelte:window on:keydown={handleKeyDown}/>

<div class="container">
    <StatusBar />
    <CommandBar isVisible={isCommandBarVisible}/>
    <div class="main-view-container">
        <ParentsSidebar />
        <ChildrenSidebar />
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
