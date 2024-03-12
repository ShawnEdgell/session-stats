<!-- EditablePost.svelte -->
<script lang="ts">
	import { supabase } from '$lib/supabaseClient';

	export let setting: any; // Input property to receive the camera setting

	let files: FileList | null = null;
	let selectedImageUrl: string | null = null;

	// Define openImageModal function
	function openImageModal(url: string) {
		selectedImageUrl = url;
	}

	// Define baseStorageUrl variable
	const baseStorageUrl =
		'https://merqjhmxmsxsdvosoguv.supabase.co/storage/v1/object/public/session-public-camera-settings/';

	// Function to handle updating the post
	async function updatePost() {
		try {
			let updateData: any = { title: setting.title, description: setting.description };
			if (files) {
				const file = files[0];
				const uniqueFileName = `${Date.now()}-${file.name}`;
				const { data, error } = await supabase.storage
					.from('session-public-camera-settings')
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

				const previousFileUrl = setting.file_url;
				if (previousFileUrl) {
					const fileName = previousFileUrl.substring(previousFileUrl.lastIndexOf('/') + 1);
					await supabase.storage.from('session-public-camera-settings').remove([fileName]);
				}

				updateData = { ...updateData, file_url: fileUrl };
			}

			const { error } = await supabase
				.from('camera_settings')
				.update(updateData)
				.eq('id', setting.id);

			if (error) {
				console.error(`Error updating post: ${error.message}`);
				return;
			}

			console.log('Post updated successfully');
		} catch (error: any) {
			console.error(`Error updating post: ${error.message}`);
		}
	}

	// Function to handle deleting the post
	async function deletePost() {
		try {
			const { error } = await supabase
				.from('camera_settings')
				.delete()
				.eq('id', setting.id)
				.single();

			if (error) {
				console.error(`Error deleting post: ${error.message}`);
				return;
			}

			console.log('Post deleted successfully');

			if (setting.file_url) {
				const fileName = setting.file_url.substring(setting.file_url.lastIndexOf('/') + 1);
				await supabase.storage.from('session-public-camera-settings').remove([fileName]);
			}
		} catch (error: any) {
			console.error(`Error deleting post: ${error.message}`);
		}
	}
</script>

<div class="card mb-4 p-4">
	<div class="flex flex-col md:flex-row">
		<div class="md:w-3/5">
			<!-- Editable form for updating camera setting -->
			<form on:submit|preventDefault={updatePost} class="space-y-4">
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
				<!-- Display file input only if file_url exists -->
				{#if setting.file_url}
					<input class="input" type="file" bind:files />
				{/if}
				<div class="flex justify-between items-center">
					<button type="submit" class="btn px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">
						Update
					</button>
					<button class="btn btn-delete variant-filled-primary" on:click={deletePost}>
						Delete
					</button>
				</div>
			</form>
		</div>

		<!-- Display image if file_url exists -->
		{#if setting.file_url}
			<div class="md:w-2/5 md:ml-4">
				<div class="image-wrapper h-full">
					<button
						class="h-full w-full mt-4 md:mt-0 object-cover cursor-pointer"
						on:click={() => openImageModal(`${baseStorageUrl}${setting.file_url}`)}
					>
						<img
							src={`${baseStorageUrl}${setting.file_url}`}
							alt={setting.title || setting.description || 'Image'}
							class="h-full w-full object-cover"
						/>
					</button>
				</div>
			</div>
		{/if}
	</div>
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
