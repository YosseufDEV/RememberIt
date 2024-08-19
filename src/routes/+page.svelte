<script lang="ts">
    import '../app.css'
    import colors from "$lib/assets/colors/colors.json"
    import DisplayArea from "./components/DisplayArea.svelte";
    import ParentsSidebar from "./components/Sidebar/ParentsSidebar.svelte"
    import ChildrenSidebar from "./components/Sidebar/ChildrenSidebar.svelte"
    import CommandBar from "./components/CommandBar.svelte";
    import generateColor from "./typescript/color_generator"

    function handleKeyDown(e: KeyboardEvent) {
        console.log(e);
    }

    // async function loadColors(): Promise<any[]> {
    //     await fetch("$lib/assets/colors/colors.json")
    //         .then(response => response.json())
    //         .then((json) => {
    //             return json;
    //         })
    //         .catch(() => {
    //         });
    //     return [];
    // }
    console.log(generateColor(colors));
</script>

<svelte:window on:keydown={handleKeyDown}/>

<div class="container">
    <CommandBar />
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
