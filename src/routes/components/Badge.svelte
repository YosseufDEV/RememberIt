<script lang="ts">
    import { Reason } from "../types";

    export let title: Reason;
</script>

<div class="container">
    <p>{title}</p> 
</div>

<style>
    .container {
        background: #AB274F; 
        border-radius: 10px;
        margin: 0 2px;
        padding: 5px;
        color: white;
        font-weight: 500;
    }

</style>
