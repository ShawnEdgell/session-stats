<script lang="ts">
	import '../app.postcss';
	import Navigation from '$lib/components/Navigation.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<div class="hidden sm:block">
			<Navigation />
		</div>
	</svelte:fragment>

	<!-- Router Slot -->
	<div class="h-full mx-auto max-w-4xl p-4">
		<slot />
	</div>
	<!-- ---- / ---- -->

	<svelte:fragment slot="footer">
		<div class="block sm:hidden">
			<Navigation />
		</div></svelte:fragment
	>
</AppShell>
