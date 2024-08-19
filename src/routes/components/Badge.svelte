<script lang="ts">
    import type { Reason } from "../typescript/types";

    export let reason: Reason;
</script>

<div class="container" style={`background: ${reason.color}`}>
    <p>{reason.label}</p> 
</div>

<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        background: #000;
        margin: 0 2px;
        padding: 3px 12px;
        color: white;
        font-weight: 500;
    }

</style>
