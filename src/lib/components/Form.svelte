<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let onSubmit: (title: string, description: string) => void;

	let title = '';
	let description = '';

	const dispatch = createEventDispatcher();

	function handleSubmit() {
		onSubmit(title, description);
		title = '';
		description = '';
	}
</script>

<div>
	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<input
			type="text"
			bind:value={title}
			placeholder="Title"
			class="w-full text-black p-2 border rounded-md"
		/>
		<textarea
			bind:value={description}
			placeholder="Description"
			class="w-full text-black p-2 border rounded-md h-40"
		></textarea>
		<button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
			>Submit</button
		>
	</form>
</div>
