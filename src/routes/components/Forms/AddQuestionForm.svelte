<script lang="ts">
    import { DATABASE } from "../../typescript/Database/CachedDatabase";
    import { type Reason } from "../../typescript/types";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let reasons: Reason[] = [];
    let questionNumber: number = 25;
    let reason: string = "";

    function handleSubmit() {
        const question: { question_number: number, reason: string }= {
            question_number: questionNumber,
            reason: reason
        }
        console.log(question);
        dispatch("addQuestion", question);
    }

    DATABASE.subscribe((db) => {
        reasons = db.tags;
    })

</script>

<form on:submit|preventDefault={handleSubmit}>
    <input placeholder="Question Number" bind:value={questionNumber} type="number">
        <select bind:value={reason}>
            {#each reasons as reason}
                <option value={reason.id}>{reason.label}</option>
            {/each}
        </select>
    <button>Add</button>
</form>

