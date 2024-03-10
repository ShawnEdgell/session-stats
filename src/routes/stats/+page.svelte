<script lang="ts">
	import { onMount } from 'svelte';
	import { Paginator } from '@skeletonlabs/skeleton';
	import Form from '$lib/components/Form.svelte';
	import type { Stat } from '$lib/statsService';
	import { fetchStats, submitStat } from '$lib/statsService';

	let stats: Stat[] = [];
	let paginationSettings = {
		page: 0,
		limit: 10,
		size: 0,
		amounts: [1, 2, 5, 10]
	};

	async function handleSubmit(title: string, description: string) {
		await submitStat(title, description);
		fetchStats();
	}

	function onPageChange(e: CustomEvent) {
		paginationSettings.page = e.detail;
		fetchStats();
	}

	async function loadData() {
		stats = await fetchStats();
		paginationSettings.size = stats.length;
	}

	$: paginatedStats = stats.slice(
		paginationSettings.page * paginationSettings.limit,
		(paginationSettings.page + 1) * paginationSettings.limit
	);

	onMount(loadData);
</script>

<div class="container">
	<Form onSubmit={handleSubmit} />

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
