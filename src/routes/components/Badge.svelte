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
        background: #AB274F; 
        border-radius: 20px;
        margin: 0 2px;
        padding: 3px 12px;
        color: white;
        font-weight: 500;
    }

</style>
