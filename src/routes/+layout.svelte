<script lang="ts">
	import '../app.postcss';
	import Navigation from '$lib/components/Navigation.svelte';
</script>

<!-- Container for the whole layout -->
<div class="h-full flex flex-col">
	<!-- Top Navigation - Visible on medium and larger screens -->
	<div class="hidden sm:block sticky top-0 w-screen z-10">
		<Navigation />
	</div>

	<!-- Main Content Area - Allows for independent scrolling -->
	<div class="space-y-8 flex-1 overflow-y-auto p-4 scrollbar-gutter">
		<slot />
	</div>

	<!-- Bottom Navigation - Visible on small screens -->
	<div class="block sm:hidden sticky bottom-0 z-10">
		<Navigation />
	</div>
</div>

<style>
	/* Custom scrollbar styles for the main content area */
	.scrollbar-gutter {
		scrollbar-gutter: stable both-edges;
	}
</style>
