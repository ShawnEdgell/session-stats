<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import { Paginator } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import type { User } from '@supabase/supabase-js';

	// Reactive variable to track authentication status
	const isAuthenticated = writable(false);
	let currentUser: User | null | undefined = null; // Store current user information

	// Check authentication status on component mount
	onMount(() => {
		supabase.auth.onAuthStateChange((_, session) => {
			isAuthenticated.set(!!session); // Update isAuthenticated based on session
			currentUser = session?.user; // Store current user information
		});
	});

	interface Stat {
		id: number;
		title: string;
		description: string;
		created_at?: Date;
		discord_id?: string; // Add discord_id to Stat interface
		editable?: boolean; // Add editable flag to track edit mode
	}

	let title = '';
	let description = '';
	let Stats: Stat[] = [];
	let paginationSettings = { page: 0, limit: 10, size: 0, amounts: [1, 2, 5, 10] };
	let isFetching = false;

	async function handleSubmit() {
		if (!currentUser) {
			console.error('User is not authenticated.');
			return;
		}

		if (title.trim() === '' || description.trim() === '') {
			console.error('Title and description cannot be empty.');
			return;
		}

		const { error } = await supabase
			.from('stats')
			.insert([{ title, description, discord_id: currentUser.id }]);

		if (error) {
			console.error(`Error submitting data: ${error.message}`);
		} else {
			console.log('Submission successful');
			title = '';
			description = '';
			fetchStats(); // Refresh camera settings after successful submission
		}
	}

	async function deletePost(id: number) {
		try {
			const { error } = await supabase.from('stats').delete().eq('id', id).single();

			if (error) {
				console.error(`Error deleting post: ${error.message}`);
			} else {
				console.log('Post deleted successfully');
				fetchStats(); // Refresh camera settings after successful deletion
			}
		} catch (error: any) {
			console.error(`Error deleting post: ${error.message}`);
		}
	}

	async function updatePost(setting: Stat) {
		try {
			const { error } = await supabase
				.from('stats')
				.update({ title: setting.title, description: setting.description })
				.eq('id', setting.id);

			if (error) {
				console.error(`Error updating post: ${error.message}`);
			} else {
				console.log('Post updated successfully');
				setting.editable = false; // Disable edit mode after successful update
				fetchStats(); // Refresh camera settings after successful update
			}
		} catch (error: any) {
			console.error(`Error updating post: ${error.message}`);
		}
	}

	async function fetchStats() {
		isFetching = true;
		const startIndex = paginationSettings.page * paginationSettings.limit;
		const endIndex = (paginationSettings.page + 1) * paginationSettings.limit - 1;

		const { data, error, count } = await supabase
			.from('stats')
			.select('*', { count: 'exact' })
			.order('created_at', { ascending: false })
			.range(startIndex, endIndex);

		if (error) {
			console.error(`Error fetching camera settings: ${error.message}`);
		} else {
			Stats = data.map((setting: Stat) => ({ ...setting, editable: false }));
			paginationSettings.size = count ?? 0;
		}

		isFetching = false;
	}

	function onPageChange(e: CustomEvent) {
		paginationSettings.page = e.detail;
		fetchStats();
	}

	// Fetch camera settings when component mounts
	onMount(fetchStats);
</script>

<div class="container">
	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<label class="block">
			<input class="input" type="text" bind:value={title} placeholder="Title" />
		</label>
		<label class="block">
			<textarea class="textarea" rows="4" bind:value={description} placeholder="Description"
			></textarea>
		</label>
		<button
			type="submit"
			disabled={!title.trim() || !description.trim() || !$isAuthenticated}
			class="btn px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">Submit</button
		>
	</form>

	<Paginator
		bind:settings={paginationSettings}
		showFirstLastButtons={false}
		showPreviousNextButtons={true}
		on:page={onPageChange}
	/>

	{#if isFetching}
		<p>Loading camera settings...</p>
	{:else if Stats.length === 0}
		<p>No camera settings found.</p>
	{:else}
		<div class="mt-8">
			{#each Stats as setting}
				<div class="card mb-4 p-4">
					{#if setting.editable}
						<!-- Editable mode -->
						<form on:submit|preventDefault={() => updatePost(setting)} class="space-y-4">
							<label class="block">
								<input class="input" type="text" bind:value={setting.title} placeholder="Title" />
							</label>
							<label class="block">
								<textarea
									class="textarea"
									rows="4"
									bind:value={setting.description}
									placeholder="Description"
								></textarea>
							</label>
							<div class="flex justify-between items-center">
								<button type="submit" class="btn px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
									>Update</button
								>
								<!-- Delete button added -->
								<button
									class="btn btn-delete variant-filled-primary"
									on:click={() => deletePost(setting.id)}>Delete</button
								>
							</div>
						</form>
					{:else}
						<!-- View mode -->
						<div class="space-y-3">
							<h2 class="text-xl font-semibold">{setting.title}</h2>
							<p>{setting.description}</p>
							<p class="text-sm text-gray-500">
								Submitted on: {setting.created_at
									? new Date(setting.created_at).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})
									: 'Unknown date'}
							</p>
							{#if currentUser && setting.discord_id === currentUser.id}
								<!-- Edit button -->
								<button
									class="btn btn-edit variant-filled-warning"
									on:click={() => (setting.editable = !setting.editable)}>Edit</button
								>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
