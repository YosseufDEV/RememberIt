<script lang="ts">
    import DisplayArea from "./components/DisplayArea.svelte";
    import ParentsSidebar from "./components/Sidebar/ParentsSidebar.svelte"
    import ChildrenSidebar from "./components/Sidebar/ChildrenSidebar.svelte"
    import '../app.css'
    import { getCurrentWindow } from "@tauri-apps/api/window";
</script>

<div class="container">
    <ParentsSidebar />
    <ChildrenSidebar />
    <DisplayArea />
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
        flex-direction: row;
    }
</style>
