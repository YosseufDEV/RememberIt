<script lang="ts">
    import { getReasons } from "../../../database";
    import { type Question } from "../../types";
    import { createEventDispatcher } from "svelte";

    let dispatch = createEventDispatcher();
    let questionNumber: number = 25;
    let reason: string = "";

    function handleSubmit() {
        const question: { question_number: number, reason: string }= {
            question_number: questionNumber,
            reason: reason
        }
        dispatch("addQuestion", question);
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    {#await getReasons()}
        {:then reasons}
            <input placeholder="Question Number" bind:value={questionNumber} type="number">
            <select bind:value={reason}>
                {#each reasons as reason}
                    <option value={reason.id}>{reason.label}</option>
                {/each}
            </select>
            <button>Add</button>
    {/await}
</form>

