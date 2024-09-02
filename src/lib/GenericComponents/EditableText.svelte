<script lang="ts">
    import { createEventDispatcher, tick } from "svelte";

    type TextType = "number" | "text";
    export let text="", type: TextType = "text"; 
    const dispatch = createEventDispatcher();

    let isEditing = false;
    let textRef: HTMLElement;

    async function handleKeyDown(e: KeyboardEvent) {
        console.log(e);
        console.log(textRef.textContent);
        if (type=="number" && !(e.code.includes('Digit') || e.code.includes('Numpad') 
             || e.code === 'ArrowLeft' || e.code === 'ArrowRight' 
             || e.code === 'Backspace' || e.code === 'Delete'
             )
             || (textRef.textContent?.length === 0 && e.keyCode === 48)
        ) 
        {
           e.preventDefault()
        }
        await tick();
    }

    function handleClick(e) {
        if(isEditing) {
            e.preventDefault();
        }
    }
    
    function enableEditing() {
        isEditing = true;
    }

    function handleFocusLost() {
        isEditing = false;
        dispatch("finishedEditing", { newText: textRef.textContent });
    }
</script>

<div>
    <p bind:this={textRef} 
       contenteditable={isEditing} 
       on:dblclick={enableEditing} 
       on:focusout={handleFocusLost} 
       on:keydown={handleKeyDown}
       on:click={handleClick}
       class={`${$$props.class}`}>{text}</p>
</div>

<style>
    div {
        overflow: hidden;
        text-wrap: nowrap;
    }
    p {
        text-overflow: ellipsis;
    }

    p:focus {
        outline: none; 
    }
</style>
