<script lang="ts">
	import { LightSwitch } from '@skeletonlabs/skeleton';
</script>

<div class="h-full flex flex-col justify-center items-center text-center space-y-5">
	<div class="block sm:hidden">
		<LightSwitch />
	</div>
	<h1 class="h1 text-4xl sm:text-5xl">Session Stats Hub</h1>
	<p>Discover and share the best stats and settings for Session: Skate Sim.</p>
	<div>
		<a href="/stats" class="btn mr-2 variant-filled-primary">Gameplay Stats</a>
		<a href="/camera" class="btn variant-filled">Camera Settings</a>
	</div>
</div>
