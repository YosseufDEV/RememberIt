<script lang="ts">
    export let color="#eee", height=1;
</script>

<div class="seperator" style={`background: ${color}; height: ${height}px;`}/>

<style>
    .seperator {
        margin-bottom: 20px;
        margin-top: 10px;
        margin-left: -10px;
        width: calc(100% + 20px);
        z-index: 10000;
        position: relative;
    }

</style>
