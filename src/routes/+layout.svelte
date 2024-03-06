<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Navigation from '$lib/components/Navigation.svelte';

	// Explicitly declare the type of scrollContainer as HTMLDivElement | null
	let scrollContainer: HTMLDivElement | null = null;

	onMount(() => {
		// Subscribe to page store changes
		page.subscribe(() => {
			// Check if the scrollContainer is available and scroll to top
			if (scrollContainer) {
				scrollContainer.scrollTo(0, 0);
			}
		});
	});
</script>

<div class="flex flex-col h-screen justify-end sm:justify-between">
	<div class="sm:block hidden">
		<Navigation />
	</div>
	<!-- Bind the scrollable div to the scrollContainer variable -->
	<div bind:this={scrollContainer} class="flex-1 scroll-smooth overflow-y-auto space-y-12 p-4">
		<slot />
	</div>
	<div class="sm:hidden">
		<Navigation />
	</div>
</div>
