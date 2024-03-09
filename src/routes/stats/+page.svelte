<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import { Paginator } from '@skeletonlabs/skeleton';

	interface Stat {
		id: number;
		title: string;
		description: string;
		created_at?: Date;
	}

	let title = '';
	let description = '';
	let stats: Stat[] = [];
	let paginationSettings = {
		page: 0,
		limit: 10,
		size: 0,
		amounts: [1, 2, 5, 10]
	};

	let formSubmitted = false;

	async function handleSubmit() {
		if (!title.trim() || !description.trim())
			return console.error('Title and description cannot be empty.');

		const { data, error } = await supabase.from('stats').insert([{ title, description }]);
		if (error) return console.error('Error submitting data:', error.message);

		console.log('Submitted:', data);
		title = '';
		description = '';
		fetchStats();
		formSubmitted = true;
	}

	async function fetchStats() {
		const { data, error } = await supabase
			.from('stats')
			.select('*')
			.order('created_at', { ascending: false });
		if (error) return console.error('Error fetching stats:', error.message);

		stats = data;
		paginationSettings.size = data.length;
	}

	function onPageChange(e: CustomEvent) {
		paginationSettings.page = e.detail;
		fetchStats();
	}

	$: paginatedStats = stats.slice(
		paginationSettings.page * paginationSettings.limit,
		(paginationSettings.page + 1) * paginationSettings.limit
	);

	onMount(fetchStats);
</script>

<div class="container">
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

	<Paginator
		bind:settings={paginationSettings}
		showFirstLastButtons={false}
		showPreviousNextButtons={true}
		on:page={onPageChange}
	/>

	<div class="mt-8">
		{#each paginatedStats as stat}
			<div class="card mb-4 p-4">
				<h2 class="text-xl font-semibold">{stat.title}</h2>
				<p>{stat.description}</p>
			</div>
		{/each}
	</div>
</div>
