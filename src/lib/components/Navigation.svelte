<script lang="ts">
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
</script>

<TabGroup
	justify="justify-center"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded=""
	border=""
	class="bg-surface-100-800-token w-full"
>
	<TabAnchor href="/" selected={$page.url.pathname === '/'}>
		<svelte:fragment slot="lead">(icon)</svelte:fragment>
		<span>
			<div class="lg:w-20">Home</div>
		</span>
	</TabAnchor>
	<TabAnchor href="/game" selected={$page.url.pathname === '/game'}>
		<svelte:fragment slot="lead">(icon)</svelte:fragment>
		<div class="lg:w-20">Game</div>
	</TabAnchor>
	<TabAnchor href="/camera" selected={$page.url.pathname === '/camera'}>
		<svelte:fragment slot="lead">(icon)</svelte:fragment>
		<div class="lg:w-20">Camera</div>
	</TabAnchor>
	<TabAnchor href="/settings" selected={$page.url.pathname === '/settings'}>
		<svelte:fragment slot="lead">(icon)</svelte:fragment>
		<div class="lg:w-20">Settings</div>
	</TabAnchor>
	<!-- ... -->
</TabGroup>
