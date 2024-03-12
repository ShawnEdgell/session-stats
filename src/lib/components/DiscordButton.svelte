<script lang="ts">
	import { signInWithDiscord, signOut } from '$lib/supabaseClient';
	import { user } from '$lib/stores'; // Import the user store

	let userName: string | null = null; // Variable to hold the user's name

	// Subscribe to changes in the user store
	user.subscribe((value) => {
		userName = value ? value.user_metadata.full_name : null;
	});
</script>

<div class="flex flex-col items-center gap-2 text-center card p-4">
	{#if userName}
		<p>Welcome, {userName}!</p>
		<!-- Display user's name -->
		<button type="button" class="btn variant-filled-secondary" on:click={signOut}>Logout</button>
	{:else}
		<p>Log in to submit your own stats & settings.</p>
		<button type="button" class="btn variant-filled-secondary" on:click={signInWithDiscord}
			>Login with Discord</button
		>
	{/if}
</div>
