<script lang="ts">
	import '../app.postcss';
	import Navigation from '$lib/components/Navigation.svelte';
</script>

<!-- Your layout component -->
<div class="h-full flex flex-col items-center">
	<!-- Top Navigation - Visible on medium and larger screens -->
	<div class="hidden sm:block sticky top-0 w-screen z-10">
		<Navigation />
	</div>

	<!-- Main Content Area - Allows for independent scrolling -->

	<div class="flex-1 max-w-4xl w-full p-4">
		<slot />
	</div>

	<!-- Bottom Navigation - Visible on small screens -->
	<div class="block sm:hidden sticky bottom-0 z-10">
		<Navigation />
	</div>
</div>
