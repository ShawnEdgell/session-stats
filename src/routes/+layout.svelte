<script lang="ts">
	import '../app.postcss';
	import Navigation from '$lib/components/Navigation.svelte';
</script>

<div class="fixed top-0 hidden sm:block w-full">
	<Navigation />
</div>
<!-- Router Slot -->
<div class="container max-w-6xl pb-16 sm:pb-0 sm:pt-16 h-full mx-auto">
	<slot />
</div>

<div class="fixed bottom-0 sm:hidden w-full">
	<Navigation />
</div>
