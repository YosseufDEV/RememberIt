<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { get } from "svelte/store";

    import type { DropZone } from "../../typescript/types";
    import { DropZones } from "../../stores/drop-zones-store";

    export let draggableRef: HTMLElement;

    let isDragged = false;
    let hoveredDropZone: DropZone | null = null;
    const dispatch = createEventDispatcher();
    
    function handleDraggableMouseDown(e: MouseEvent) {
        isDragged = true;
        dispatch("dragstart");
    }

    // TODO: Implement ZIndex & Sleep for this function (too expensive)
    function getDragZoneHoveringOn(e: MouseEvent) {
        let zones = get(DropZones);
        let boundries = draggableRef.getBoundingClientRect();

        const draggableStartY = e.y;
        const draggableStartX = e.x;

        const draggableEndY = e.y+boundries.height;
        const draggableEndX = e.x+boundries.width;

        for(const zone of zones) {
            const zoneStartY = zone.top,
                  zoneEndY = zone.top + zone.height;
            const zoneStartX = zone.left,
                  zoneEndX = zone.left + zone.width;
                
            const s1 = draggableStartY >= zoneStartY && draggableStartY <= zoneEndY;
            const s2 = draggableStartX >= zoneStartX && draggableStartX <= zoneEndX;

            // INFO: To handle hovering from the end
            // const s3 = draggableEndY >= zoneStartY && draggableEndY <= zoneEndY;
            // const s4 = draggableEndX >= zoneStartX && draggableEndX <= zoneEndX;

            if(s1 && s2) {
                if(zone != hoveredDropZone) {
                    zone.hoverEnterCallback();
                }
                return zone;
            }
            if(hoveredDropZone) {
                hoveredDropZone.hoverLeaveCallback(); 
            }
        }
        return null;
    }

    function handleDraggableMouseMove(e: MouseEvent) {
        if(isDragged) {
            dispatch("dragmove", { x: e.x, y: e.y });
            hoveredDropZone = getDragZoneHoveringOn(e)
        }
    }

    function handleDraggableMouseUp(e: MouseEvent) {
        isDragged = false;
        if(hoveredDropZone) {
            hoveredDropZone.dropCallback(); 
        }
        dispatch("dragdrop");
    }

</script>

<div on:mousedown={handleDraggableMouseDown}
     on:mousemove={handleDraggableMouseMove}
     on:mouseup={handleDraggableMouseUp}>
    <slot />
</div>
