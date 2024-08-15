<script lang="ts">
    export let label: string;
</script>

<div class="container">
    <p>{label}</p> 
</div>

<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 75px;
        background: #AB274F; 
        border-radius: 20px;
        margin: 0 2px;
        padding: 2px;
        color: white;
        font-weight: 500;
    }

</style>
