<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import { Paginator } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import type { User } from '@supabase/supabase-js';
	import Modal from '$lib/components/Modal.svelte';

	const isAuthenticated = writable(false);
	let currentUser: User | null | undefined = null;
	onMount(() => {
		supabase.auth.onAuthStateChange((_, session) => {
			isAuthenticated.set(!!session);
			currentUser = session?.user;
		});
	});

	interface Stat {
		id: number;
		title: string;
		description: string;
		created_at?: Date;
		discord_id?: string;
		editable?: boolean;
		file_url?: string;
		uploader_name?: string;
	}

	let title = '';
	let description = '';
	let Stats: Stat[] = [];
	let paginationSettings = { page: 0, limit: 10, size: 0, amounts: [1, 2, 5, 10] };
	let isFetching = false;
	let files: FileList | null = null;
	let selectedImageUrl: string | null = null;

	function openImageModal(url: string) {
		selectedImageUrl = url;
	}

	function closeImageModal() {
		selectedImageUrl = null;
	}

	async function handleSubmit() {
		if (!currentUser) {
			console.error('User is not authenticated.');
			return;
		}

		if (title.trim() === '' || description.trim() === '' || !files) {
			console.error('Title, description, and file cannot be empty.');
			return;
		}

		const file = files[0];
		const uniqueFileName = `${Date.now()}-${file.name}`;
		const { data, error } = await supabase.storage
			.from('session-public-gameplay-settings')
			.upload(uniqueFileName, file, { cacheControl: '3600' });

		if (error) {
			console.error(`Error uploading file: ${error.message}`);
			return;
		}

		const fileUrl = data?.path;

		if (!fileUrl) {
			console.error('File URL not found');
			return;
		}

		const uploaderName = currentUser.user_metadata.full_name;

		const { error: insertError } = await supabase.from('stats').insert([
			{
				title,
				description,
				file_url: fileUrl,
				discord_id: currentUser.id,
				uploader_name: uploaderName
			}
		]);

		if (insertError) {
			console.error(`Error submitting data: ${insertError.message}`);
		} else {
			console.log('Submission successful');
			title = '';
			description = '';
			files = null; // Clear the files selection
			fetchStats();
		}
	}

	async function deletePost(id: number, fileUrl: string | undefined) {
		try {
			const { error } = await supabase.from('stats').delete().eq('id', id).single();

			if (error) {
				console.error(`Error deleting post: ${error.message}`);
			} else {
				console.log('Post deleted successfully');

				// Delete associated image from storage
				if (fileUrl) {
					const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
					await supabase.storage.from('session-public-gameplay-settings').remove([fileName]);
				}

				fetchStats();
			}
		} catch (error: any) {
			console.error(`Error deleting post: ${error.message}`);
		}
	}

	async function updatePost(setting: Stat) {
		try {
			let updateData: any = { title: setting.title, description: setting.description };
			if (files) {
				const file = files[0];
				const uniqueFileName = `${Date.now()}-${file.name}`; // Create a unique filename
				const { data, error } = await supabase.storage
					.from('session-public-gameplay-settings')
					.upload(uniqueFileName, file, { cacheControl: '3600' });

				if (error) {
					console.error(`Error uploading file: ${error.message}`);
					return;
				}

				const fileUrl = data?.path;

				if (!fileUrl) {
					console.error('File URL not found');
					return;
				}

				// Delete previous image
				const previousFileUrl = setting.file_url;
				if (previousFileUrl) {
					const fileName = previousFileUrl.substring(previousFileUrl.lastIndexOf('/') + 1);
					await supabase.storage.from('session-public-gameplay-settings').remove([fileName]);
				}

				updateData = { ...updateData, file_url: fileUrl };
			}

			const { error } = await supabase.from('stats').update(updateData).eq('id', setting.id);

			if (error) {
				console.error(`Error updating post: ${error.message}`);
			} else {
				console.log('Post updated successfully');
				setting.editable = false;
				fetchStats();
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

	onMount(fetchStats);
</script>

<div class="container">
	<form on:submit|preventDefault={handleSubmit} class="card p-4 space-y-4">
		<h1>Upload Camera Settings</h1>
		<label class="block">
			<input class="input" type="text" bind:value={title} placeholder="Title" />
		</label>
		<label class="block">
			<textarea class="textarea" rows="4" bind:value={description} placeholder="Description"
			></textarea>
		</label>
		<div>
			<input class="input" type="file" bind:files />
			<small class="text-gray-500">Max file size: 2MB</small>
		</div>
		<div class="flex justify-end">
			<button
				type="submit"
				disabled={!title.trim() || !description.trim() || !files || !$isAuthenticated}
				class="btn px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
			>
				Submit
			</button>
		</div>
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
					<div class="flex flex-col md:flex-row">
						<!-- Display other data -->
						<div class="md:w-3/5">
							{#if setting.editable}
								<form on:submit|preventDefault={() => updatePost(setting)} class="space-y-4">
									<label class="block">
										<input
											class="input"
											type="text"
											bind:value={setting.title}
											placeholder="Title"
										/>
									</label>
									<label class="block">
										<textarea
											class="textarea"
											rows="4"
											bind:value={setting.description}
											placeholder="Description"
										></textarea>
									</label>
									<input class="input" type="file" bind:files />
									<div class="flex justify-between items-center">
										<button
											type="submit"
											class="btn px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
										>
											Update
										</button>
										<button
											class="btn btn-delete variant-filled-primary"
											on:click={() => deletePost(setting.id, setting.file_url)}>Delete</button
										>
									</div>
								</form>
							{:else}
								<div class="space-y-3 mb-4 md:mb-0">
									<h2 class="text-xl font-semibold">{setting.title}</h2>
									<p>{setting.description}</p>
									<div>
										<p class="text-sm text-gray-500">
											Submitted on: {setting.created_at
												? new Date(setting.created_at).toLocaleDateString('en-US', {
														year: 'numeric',
														month: 'long',
														day: 'numeric'
													})
												: 'Unknown date'}
										</p>
										<p class="text-sm text-gray-500">
											Uploaded by: {setting.uploader_name ? setting.uploader_name : 'Unknown user'}
										</p>
									</div>
									{#if currentUser && setting.discord_id === currentUser.id}
										<button
											class="btn btn-edit variant-filled-warning"
											on:click={() => (setting.editable = !setting.editable)}
										>
											Edit
										</button>
									{/if}
								</div>
							{/if}
						</div>

						<!-- Display image with modal functionality -->
						{#if setting.file_url}
							<div class="md:w-2/5 md:ml-4">
								<div class="image-wrapper h-full">
									<button
										class="h-full w-full mt-4 md:mt-0 object-cover cursor-pointer"
										on:click={() =>
											openImageModal(
												`https://merqjhmxmsxsdvosoguv.supabase.co/storage/v1/object/public/session-public-gameplay-settings/${setting.file_url}`
											)}
									>
										<img
											src={`https://merqjhmxmsxsdvosoguv.supabase.co/storage/v1/object/public/session-public-gameplay-settings/${setting.file_url}`}
											alt={setting.title || setting.description || 'Image'}
											class="h-full w-full object-cover"
										/>
									</button>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
		<!-- Display the modal component -->
		{#if selectedImageUrl}
			<Modal imageUrl={selectedImageUrl} onClose={closeImageModal} />
		{/if}
	{/if}
</div>

<style>
	.image-wrapper {
		position: relative;
		width: 100%;
		padding-top: 56.25%; /* 16:9 aspect ratio */
		overflow: hidden;
	}

	.image-wrapper img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
