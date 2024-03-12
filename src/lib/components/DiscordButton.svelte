<script lang="ts">
	import { signInWithDiscord, signOut } from '$lib/supabaseClient';
	import { supabase } from '$lib/supabaseClient'; // Import supabase client instance

	// Reactive variable to track authentication status
	import { writable } from 'svelte/store';
	const isAuthenticated = writable(false); // Initialize as false by default
	let userName = ''; // Variable to hold the user's name

	// Check authentication status on component mount
	supabase.auth.onAuthStateChange((_, session) => {
		isAuthenticated.set(session !== null); // Update isAuthenticated based on session
		if (session) {
			// If user is authenticated, extract user's name from session
			userName = session.user.user_metadata.full_name;
		}
	});
</script>

<div class="flex flex-col items-center gap-2 text-center card p-4">
	{#if $isAuthenticated}
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
