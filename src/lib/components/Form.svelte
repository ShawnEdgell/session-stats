<script lang="ts">
	import { isAuthenticated } from '$lib/stores';
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import type { User } from '@supabase/supabase-js';

	// Props to specify the submission target
	export let submitTo: 'camera' | 'stats';

	const dispatch = createEventDispatcher();
	let currentUser: User | null | undefined = null;
	onMount(() => {
		supabase.auth.onAuthStateChange((_, session) => {
			isAuthenticated.set(!!session);
			currentUser = session?.user;
		});
	});

	let title = '';
	let description = '';
	let files: FileList | null = null;
	let fileInputElement: HTMLInputElement | null = null;

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
		// Determine the storage path based on the submission target
		const storagePath =
			submitTo === 'camera' ? 'session-public-camera-settings' : 'session-public-gameplay-settings';
		const { data, error } = await supabase.storage
			.from(storagePath)
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
		// Determine the database table based on the submission target
		const table = submitTo === 'camera' ? 'camera_settings' : 'stats';
		const { error: insertError } = await supabase.from(table).insert([
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
			files = null;
			if (fileInputElement) {
				fileInputElement.value = ''; // Clear the file input
			}
			dispatch('formSubmitted'); // Emit event indicating form submission
		}
	}

	function updateTitle(event: Event) {
		title = (event.target as HTMLInputElement).value;
	}

	function updateDescription(event: Event) {
		description = (event.target as HTMLTextAreaElement).value;
	}
</script>

{#if $isAuthenticated}
	<form on:submit|preventDefault={handleSubmit} class="card p-4 space-y-4">
		<!-- Input fields for title and description -->
		<label class="block">
			<input
				class="input"
				type="text"
				bind:value={title}
				placeholder="Title"
				maxlength="50"
				on:input={updateTitle}
			/>
			<small class="text-gray-500">Characters: {title.length}/50</small>
		</label>
		<label class="block">
			<textarea
				class="textarea"
				rows="4"
				bind:value={description}
				placeholder="Description"
				maxlength="200"
				on:input={updateDescription}
			></textarea>
			<small class="text-gray-500">Characters: {description.length}/200</small>
		</label>
		<!-- File input -->
		<div>
			<input class="input" type="file" bind:files bind:this={fileInputElement} />
			<small class="text-gray-500"> Max file size: 2MB. Supported formats: JPG, PNG. </small>
		</div>
		<!-- Submit button -->
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
{/if}
