<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { get } from "svelte/store";

    import type { DropZone } from "../../typescript/types";
    import { DropZones } from "../../stores/drop-zones-store";

    export let draggableRef: HTMLElement, draggableItemMetadata = {};

    let isDragged = false;
    let hoveredDropZone: DropZone | null = null;
    const dispatch = createEventDispatcher();
    
    // TODO: Implement ZIndex & Sleep for this function (too expensive)
    function getDragZoneHoveringOn(e: MouseEvent) {
        let zones = get(DropZones);

        const draggableStartY = e.y;
        const draggableStartX = e.x;

        for(const zone of zones) {
            const zoneStartY = zone.top,
                  zoneEndY = zone.top + zone.height;
            const zoneStartX = zone.left,
                  zoneEndX = zone.left + zone.width;
                
            const s1 = draggableStartY >= zoneStartY && draggableStartY <= zoneEndY;
            const s2 = draggableStartX >= zoneStartX && draggableStartX <= zoneEndX;

            if(s1 && s2) {
                if(zone != hoveredDropZone) {
                    zone.hoverEnterCallback({ item: draggableItemMetadata });
                }
                return zone;
            }
            if(hoveredDropZone) {
                hoveredDropZone.hoverLeaveCallback({ item: draggableItemMetadata }); 
            }
        }
        return null;
    }

    function handleDraggableMouseDown(e: MouseEvent) {
        isDragged = true;
        dispatch("dragstart");
    }

    function handleDraggableMouseMove(e: MouseEvent) {
        if(isDragged) {
            dispatch("dragmove");
            hoveredDropZone = getDragZoneHoveringOn(e)

            draggableRef.style['position'] = "absolute"
            draggableRef.style['top'] = `${e.y - 20}px`
            draggableRef.style['left'] = `${e.x - 20}px`
        }
    }

    function handleDraggableMouseUp() {
        isDragged = false;
        if(hoveredDropZone) {
            hoveredDropZone.dropCallback({ item: draggableItemMetadata }); 
            dispatch("dragdrop");
        }
        draggableRef.style['position'] = 'relative';
        draggableRef.style['top'] = draggableRef.style['left'] = '0';
    }

</script>

<svelte:window on:mousemove={handleDraggableMouseMove}/>
<div on:mousedown={handleDraggableMouseDown}
     on:mousemove={handleDraggableMouseMove}
     on:mouseup={handleDraggableMouseUp}>
    <slot />
</div>
