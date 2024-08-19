<script>
    let isVisible = "none";
    function ToggleCommandBar() {
        console.log(isVisible);
        if(isVisible == "none") {
            isVisible = "all"
        } else {
            isVisible = "none"
        }
    }
    // ToggleCommandBar();
</script>
<div class="container" style={`display: ${isVisible};`}>
    <div class="command-bar">
        Search
    </div>
</div>
<style>
    .container {
        font-weight: bold;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100000;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .command-bar {
        border-radius: 25px;
        z-index: 100000;
        padding: 15px;
        background: rgba(50,50,50, 0.5);
        color: white;
        backdrop-filter: blur(150px);
        height: 450px;
        width: 750px;
        margin: auto;
    }
</style>
