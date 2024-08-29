<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import type { DropZone } from "../../typescript/types";
    import { get } from "svelte/store";
    import { DropZones } from "../../stores/drop-zones-store";

    const dispatch = createEventDispatcher();

    let dropZoneRef: HTMLElement;

    function registerDropZone(dropZoneRef: HTMLElement) {
        const DROP_ZONES = get(DropZones);

        const dropZone: DropZone = {
            top: dropZoneRef.getBoundingClientRect().top,
            left: dropZoneRef.getBoundingClientRect().left,
            width: dropZoneRef.clientWidth,
            height: dropZoneRef.clientHeight,
            hoverEnterCallback: handleHoverEnter,
            hoverLeaveCallback: handleHoverLeave,
            dropCallback: (itemMetadata) => handleDrop(itemMetadata)
        }

        DROP_ZONES.push(dropZone);
        DropZones.set(DROP_ZONES);
    }

    function handleHoverEnter() {
        dispatch("hoverenter")
    }

    function handleHoverLeave() {
        dispatch("hoverleave")
    }

    function handleDrop(itemMetadata: Object) {
        dispatch("drop", itemMetadata)
    }

    onMount(() => {
        registerDropZone(dropZoneRef);
    })
    
</script>

<div class="container" bind:this={dropZoneRef}>
    <slot />
</div>

<style>
    .container {
        width: 100%;
        height: 100%;
    }
</style>
