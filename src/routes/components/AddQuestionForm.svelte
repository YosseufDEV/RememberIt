<script lang="ts">
    import { Reason, type Question } from "../types";
    import { createEventDispatcher } from "svelte";

    let dispatch = createEventDispatcher();
    let questionNumber: number = 25;
    let reason: Reason = Reason.DIDNT_THINK;

    function handleSubmit() {
        const question: Question = {
            question_number: questionNumber,
            reason: [reason]
        }
        dispatch("addQuestion", question);
    }

</script>

<form on:submit|preventDefault={handleSubmit}>
    <input placeholder="Question Number" bind:value={questionNumber} type="number">
    <select bind:value={reason}>
        <option value={Reason.DIDNT_THINK}>Didn't Think</option>
        <option value={Reason.COULDNT_RECALL}>Couldn't Memorize</option>
        <option value={Reason.COULDNT_UNDERSTAND} >Couldn't Understand</option>
    </select>
    <button>Add</button>
</form>

