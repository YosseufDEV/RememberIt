<script lang="ts">
    import Sidebar from "./components/Sidebar.svelte";
    import DisplayArea from "./components/DisplayArea.svelte";
    import '../app.css'
</script>

<div class="container">
    <DisplayArea />
    <Sidebar />
</div>

<style>
    .container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #f2f2f2;
        display: flex;
        flex-direction: row;
    }
</style>
