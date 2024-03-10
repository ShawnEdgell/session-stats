<script lang="ts">
	import { signInWithDiscord, signOut } from '$lib/supabaseClient';
	import { supabase } from '$lib/supabaseClient'; // Import supabase client instance
	import { writable } from 'svelte/store'; // Import Svelte store

	// Reactive variable to track authentication status
	const isAuthenticated = writable(false); // Initialize as false by default

	// Check authentication status on component mount
	supabase.auth.onAuthStateChange((_, session) => {
		isAuthenticated.set(session !== null); // Update isAuthenticated based on session
	});

	// Function to handle login or logout
	async function handleAuth() {
		if (isAuthenticated) {
			await signOut();
		} else {
			await signInWithDiscord();
		}
	}
</script>

<button type="button" class="btn variant-filled-secondary" on:click={handleAuth}>
	{#if $isAuthenticated}
		Logout
	{:else}
		Login with Discord
	{/if}
</button>
