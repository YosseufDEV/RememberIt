<script lang="ts">
    export let color="#eee", height=1;
</script>

<div class="seperator" style={`background: ${color}; height: ${height}px;`}/>

<style>
    .seperator {
        position: absolute;
        transform: translateZ(-10px);
        margin-bottom: 20px;
        margin-top: 10px;
        margin-left: -10px;
        width: calc(100% + 20px);
        position: relative;
    }

</style>
