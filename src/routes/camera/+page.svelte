<!-- Import the Carousel component -->
<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Form from '$lib/components/Form.svelte';
	import DiscordButton from '$lib/components/DiscordButton.svelte';
	import { Paginator } from '@skeletonlabs/skeleton';
	import { isAuthenticated } from '$lib/stores';
	import type { CameraSetting, PaginationSettings, User, ImageUrl } from '$lib/types';
	import { deleteItem, updateItem } from '$lib/common';
	import Carousel from '$lib/components/Carousel.svelte'; // Import the Carousel component

	let currentUser: User = null;
	let selectedImageUrl: ImageUrl = null;

	const baseStorageUrl =
		'https://merqjhmxmsxsdvosoguv.supabase.co/storage/v1/object/public/session-public-camera-settings/';

	onMount(() => {
		supabase.auth.onAuthStateChange((_, session) => {
			isAuthenticated.set(!!session);
			currentUser = session?.user;
		});
		fetchCameraSettings();
	});

	let cameraSettings: CameraSetting[] = [];
	let paginationSettings: PaginationSettings = {
		page: 0,
		limit: 10,
		size: 0,
		amounts: [1, 2, 5, 10]
	};
	let isFetching = false;
	let files: FileList | null = null;
	let isFetchingCameraSettings = false;

	function openImageModal(url: string) {
		selectedImageUrl = url;
	}

	function closeImageModal() {
		selectedImageUrl = null;
	}

	async function deletePost(id: number, fileUrl: string | undefined) {
		try {
			await deleteItem('camera_settings', id, fileUrl);

			isFetchingCameraSettings = true;

			if (!isFetching) {
				fetchCameraSettings();
			}
		} catch (error: any) {
			console.error(`Error deleting post: ${error.message}`);
		}
	}

	async function updatePost(setting: CameraSetting) {
		try {
			await updateItem('camera_settings', setting, files);

			if (!isFetchingCameraSettings) {
				fetchCameraSettings();
			}
		} catch (error: any) {
			console.error(`Error updating post: ${error.message}`);
		}
	}

	async function fetchCameraSettings() {
		try {
			if (isFetchingCameraSettings) {
				return;
			}
			isFetchingCameraSettings = true;

			isFetching = true;
			const startIndex = paginationSettings.page * paginationSettings.limit;
			const endIndex = (paginationSettings.page + 1) * paginationSettings.limit - 1;

			const { data, error, count } = await supabase
				.from('camera_settings')
				.select('*', { count: 'exact' })
				.order('created_at', { ascending: false })
				.range(startIndex, endIndex);

			if (error) {
				console.error(`Error fetching camera settings: ${error.message}`);
				return;
			}

			cameraSettings = data.map((setting: CameraSetting) => ({ ...setting, editable: false }));
			paginationSettings.size = count ?? 0;
		} catch (error: any) {
			console.error(`Error fetching camera settings: ${error.message}`);
		} finally {
			isFetching = false;
			isFetchingCameraSettings = false;
		}
	}

	function onPageChange(e: CustomEvent) {
		paginationSettings.page = e.detail;
		fetchCameraSettings();
	}
</script>

<div class="container">
	<DiscordButton />
	<Form submitTo="camera" on:formSubmitted={fetchCameraSettings} />
	<Paginator
		bind:settings={paginationSettings}
		showFirstLastButtons={false}
		showPreviousNextButtons={true}
		on:page={onPageChange}
	/>

	{#if isFetching}
		<p>Loading camera settings...</p>
	{:else if cameraSettings.length === 0}
		<p>No camera settings found.</p>
	{:else}
		<div class="mt-8">
			{#each cameraSettings as setting}
				<div class="card mb-4 p-4">
					<div class="flex flex-col lg:flex-row">
						<div class="lg:w-1/2">
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
									<div class="flex justify-between items-center">
										<div class="flex w-full justify-between mb-4 lg:mb-0">
											<button
												type="submit"
												class="btn px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
												>Update</button
											>
											<button
												class="btn btn-delete variant-filled-primary"
												on:click={() => deletePost(setting.id, setting.file_url)}>Delete</button
											>
										</div>
									</div>
								</form>
							{:else}
								<div class="space-y-3 mb-4 lg:mb-0">
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
											on:click={() => (setting.editable = !setting.editable)}>Edit</button
										>
									{/if}
								</div>
							{/if}
						</div>

						<!-- Use the Carousel component to display all images -->
						{#if setting.file_url && setting.file_url.length > 0}
							<div class="lg:w-1/2 lg:ml-4">
								<Carousel>
									{#each setting.file_url as url}
										<img
											src={`${baseStorageUrl}${url}`}
											alt={setting.title || setting.description || 'Image'}
											on:click={() => openImageModal(`${baseStorageUrl}${url}`)}
											style="aspect-ratio: 16/9; object-fit: cover;"
										/>
									{/each}
								</Carousel>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		{#if selectedImageUrl}
			<Modal imageUrl={selectedImageUrl} onClose={closeImageModal} />
		{/if}
	{/if}
</div>
