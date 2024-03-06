<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import '../app.postcss';
	import Navigation from '$lib/components/Navigation.svelte';

	// Scroll to top whenever the page changes
	onMount(() => {
		page.subscribe(() => {
			window.scrollTo(0, 0);
		});
	});
</script>

<div class="flex flex-col h-screen justify-end sm:justify-between">
	<!-- Conditional rendering for Navigation based on screen size -->
	<div class="sm:block hidden">
		<Navigation />
	</div>
	<!-- Scrollable Router Slot -->
	<div class="flex-1 overflow-y-auto space-y-12 p-4">
		<slot />
	</div>
	<!-- Navigation for larger screens, if needed at the top -->
	<div class="sm:hidden">
		<Navigation />
	</div>
</div>
