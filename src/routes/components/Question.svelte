<script lang="ts">
    import type { Reason } from "../types";
    import Badge from "./Badge.svelte";

    export let number: number, reasons: string[];
</script>

<div class="container">
    <div class="number-container">
        <p>{number}</p>
    </div>
    {#each reasons as reason}
        <Badge label={reason}/>
    {/each}
</div>

<style>
    .container {
        width: fit-content;
        background: rgba(125, 125, 125, 0.5);
        display: flex;
        padding: 5px;
        margin: 15px 0px;
        border-radius: 15px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
        overflow: hidden;
    }
    .number-container {
        color: white;
        border-radius: 10px;
        border-top-right-radius: 0px;
        border-bottom: 0px;
        padding: 2px;
        width: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: -5px -5px;
        margin-right: 10px;
        background: #9E2449;
        font-weight: 500;
    }
</style>
