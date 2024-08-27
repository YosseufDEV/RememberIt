<script>
    import { getCurrentWindow } from '@tauri-apps/api/window'
    import { onMount } from 'svelte';
    import ChromeMaximize from '$lib/assets/icons/ChromeMaximize.svelte';
    import ChromeMinimize from '$lib/assets/icons/ChromeMinimize.svelte';
    import ChromeClose from '$lib/assets/icons/ChromeClose.svelte';
    import ChromeMaximized from '$lib/assets/icons/ChromeMaximized.svelte';

    const ICON_SIZE = 11;
    let COLOR = "#fff";
    let isMaximized = false;

    async function listenToMaximize() {
        await getCurrentWindow().onResized(async () => {
            if(await getCurrentWindow().isMaximized()) {
                isMaximized = true;
            } else {
                isMaximized = false
            }
        })
    }

    async function listenToIsFocused() {
        await getCurrentWindow().onFocusChanged(async () => {
            if(await getCurrentWindow().isFocused()) {
                COLOR = "#fff";
            } else {
                COLOR = "#6f6f6f"
            }
        })
    }
    
    onMount(async () => {
        let titleBarMinimize = document.getElementById("titlebar-minimize")
        let titleBarMaximize = document.getElementById("titlebar-maximize")
        let titleBarClose = document.getElementById("titlebar-close")

        if(titleBarMaximize) {
            titleBarMaximize.addEventListener('click', () => getCurrentWindow().toggleMaximize())
        }

        if(titleBarMinimize) {
            titleBarMinimize.addEventListener('click', () => getCurrentWindow().minimize())
        }

        if(titleBarClose) {
            titleBarClose.addEventListener('click', () => getCurrentWindow().close())
        }

        await listenToMaximize();
        await listenToIsFocused();
    })
</script>

<div data-tauri-drag-region class="titlebar">
    <div class="titlebar-button" id="titlebar-minimize">
        <ChromeMinimize size={ICON_SIZE} color={COLOR}/>
    </div>
    <div class="titlebar-button" id="titlebar-maximize">
        {#if isMaximized}
            <ChromeMaximized size={ICON_SIZE} color={COLOR}/>
            {:else}
                <ChromeMaximize size={ICON_SIZE} color={COLOR} />
        {/if}
    </div>
    <div class="titlebar-button close-button-container" id="titlebar-close">
        <ChromeClose size={ICON_SIZE} color={COLOR}/>
    </div>
</div>

<style>
    .titlebar {
        height: 40px;
        z-index: 1000000;
        background: none;
        user-select: none;
        display: flex;
        justify-content: flex-end;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        display: grid;
        grid-template-columns: auto auto auto;
    }

    .titlebar-button {
        padding: 6px 7px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
    }

    .titlebar-button:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .titlebar-button:active {
        background: rgba(125, 125, 125, 0.05);
    }

    .close-button-container {
        width: 35px;
        margin-right: 0;
    }

    .close-button-container:hover {
        background: #c42b1c;
    }

    .close-button-container:active {
        background: #f1707a;
    }
</style>
