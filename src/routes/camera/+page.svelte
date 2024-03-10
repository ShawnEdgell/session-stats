<script lang="ts">
	import type { CameraSetting } from '$lib/cameraService';
	import { onMount } from 'svelte';
	import { Paginator } from '@skeletonlabs/skeleton';
	import Form from '$lib/components/Form.svelte';
	import { fetchCameraSettings, submitCameraSetting } from '$lib/cameraService';

	let title = '';
	let description = '';
	let cameraSettings: CameraSetting[] = [];
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

		await submitCameraSetting(title, description);
		fetchCameraSettings();
		title = '';
		description = '';
		formSubmitted = true;
	}

	async function loadData() {
		cameraSettings = await fetchCameraSettings();
		paginationSettings.size = cameraSettings.length;
	}

	function onPageChange(e: CustomEvent) {
		paginationSettings.page = e.detail;
		fetchCameraSettings();
	}

	$: paginatedCameraSettings = cameraSettings.slice(
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
		{#each paginatedCameraSettings as setting}
			<div class="card mb-4 p-4">
				<h2 class="text-xl font-semibold">{setting.title}</h2>
				<p>{setting.description}</p>
			</div>
		{/each}
	</div>
</div>
