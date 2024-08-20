<script lang="ts">
    import type { Reason } from "../typescript/types";

    export let reason: Reason;
</script>

<div class="container" style={`background: ${reason.color}; box-shadow: 0 0 50px ${reason.color}a5;`}>
    <p class="label">{reason.label}</p> 
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
    }

    .label {
        font-weight: 500;
    }

</style>
