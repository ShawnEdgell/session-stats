<script lang="ts">
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { signInWithDiscord, signOut } from '$lib/supabaseClient';
	import { supabase } from '$lib/supabaseClient'; // Import supabase client instance

	// Reactive variable to track authentication status
	import { writable } from 'svelte/store';
	const isAuthenticated = writable(false); // Initialize as false by default

	// Check authentication status on component mount
	supabase.auth.onAuthStateChange((_, session) => {
		isAuthenticated.set(session !== null); // Update isAuthenticated based on session
	});
</script>

<div class="h-full flex flex-col justify-center items-center text-center space-y-5">
	<h2 class="h2">LightSwitch</h2>
	<LightSwitch />
	<h2 class="h2">Discord</h2>
	{#if $isAuthenticated}
		<button type="button" class="btn variant-filled-secondary" on:click={signOut}>Logout</button>
	{:else}
		<button type="button" class="btn variant-filled-secondary" on:click={signInWithDiscord}
			>Login with Discord</button
		>
	{/if}
</div>
