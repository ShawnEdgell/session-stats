<script lang="ts">
	import { AppBar, TabGroup, Tab, LightSwitch, TabAnchor } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
</script>

<AppBar
	gridColumns="grid-cols-3"
	slotTrail="place-content-end"
	padding="px-4 py-0"
	slotDefault="place-self-center"
>
	<svelte:fragment slot="lead">
		<div></div>
	</svelte:fragment>
	<TabGroup
		justify="justify-center"
		active="variant-filled-primary"
		hover="sm:hover:variant-soft-primary"
		flex="flex-1 sm:flex-none"
		rounded=""
		border=""
		class="bg-surface-100-800-token w-screen"
	>
		<TabAnchor href="/" selected={$page.url.pathname === '/'}>
			<svelte:fragment slot="lead">
				<div class="flex flex-col items-center justify-center">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="text-current"
					>
						<path
							d="M22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
						<path d="M15 18H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
					</svg>
				</div>
			</svelte:fragment>
			<div class="min-w-16">
				<span>Home</span>
			</div>
		</TabAnchor>

		<TabAnchor href="/stats" selected={$page.url.pathname === '/stats'}>
			<svelte:fragment slot="lead">
				<div class="flex flex-col items-center justify-center text-current">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M15 5L9.5 5C8.56538 5 8.09808 5 7.75 5.20096C7.52197 5.33261 7.33261 5.52197 7.20096 5.75C7 6.09808 7 6.56538 7 7.5C7 8.43462 7 8.90192 7.20096 9.25C7.33261 9.47803 7.52197 9.66739 7.75 9.79904C8.09808 10 8.56538 10 9.5 10L18.5 10C19.4346 10 19.9019 10 20.25 9.79904C20.478 9.66739 20.6674 9.47803 20.799 9.25C21 8.90192 21 8.43462 21 7.5C21 6.56538 21 6.09808 20.799 5.75C20.6674 5.52197 20.478 5.33261 20.25 5.20096C19.9704 5.03954 19.6139 5.00778 19 5.00153"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
						<path
							d="M7 16.5C7 15.5654 7 15.0981 7.20096 14.75C7.33261 14.522 7.52197 14.3326 7.75 14.201C8.09808 14 8.56538 14 9.5 14H15.5C16.4346 14 16.9019 14 17.25 14.201C17.478 14.3326 17.6674 14.522 17.799 14.75C18 15.0981 18 15.5654 18 16.5C18 17.4346 18 17.9019 17.799 18.25C17.6674 18.478 17.478 18.6674 17.25 18.799C16.9019 19 16.4346 19 15.5 19H9.5C8.56538 19 8.09808 19 7.75 18.799C7.52197 18.6674 7.33261 18.478 7.20096 18.25C7 17.9019 7 17.4346 7 16.5Z"
							stroke="currentColor"
							stroke-width="1.5"
						/>
						<path
							d="M3 14L3 2M3 22L3 18"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
				</div></svelte:fragment
			>
			<div class="min-w-16">
				<span class="text-sm">Stats</span>
			</div>
		</TabAnchor>
		<TabAnchor href="/camera" selected={$page.url.pathname === '/camera'}>
			<svelte:fragment slot="lead">
				<div class="flex flex-col items-center justify-center">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="text-current"
					>
						<path
							d="M21.1935 16.793C20.8437 19.2739 20.6689 20.5143 19.7717 21.2572C18.8745 22 17.5512 22 14.9046 22H9.09536C6.44881 22 5.12553 22 4.22834 21.2572C3.33115 20.5143 3.15626 19.2739 2.80648 16.793L2.38351 13.793C1.93748 10.6294 1.71447 9.04765 2.66232 8.02383C3.61017 7 5.29758 7 8.67239 7H15.3276C18.7024 7 20.3898 7 21.3377 8.02383C22.0865 8.83268 22.1045 9.98979 21.8592 12"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
						<path
							d="M19.5617 7C19.7904 5.69523 18.7863 4.5 17.4617 4.5H6.53788C5.21323 4.5 4.20922 5.69523 4.43784 7"
							stroke="currentColor"
							stroke-width="1.5"
						/>
						<path
							d="M17.4999 4.5C17.5283 4.24092 17.5425 4.11135 17.5427 4.00435C17.545 2.98072 16.7739 2.12064 15.7561 2.01142C15.6497 2 15.5194 2 15.2588 2H8.74099C8.48035 2 8.35002 2 8.24362 2.01142C7.22584 2.12064 6.45481 2.98072 6.45704 4.00434C6.45727 4.11135 6.47146 4.2409 6.49983 4.5"
							stroke="currentColor"
							stroke-width="1.5"
						/>
						<circle cx="16.5" cy="11.5" r="1.5" stroke="currentColor" stroke-width="1.5" />
						<path
							d="M19.9999 20L17.1157 17.8514C16.1856 17.1586 14.8004 17.0896 13.7766 17.6851L13.5098 17.8403C12.7984 18.2542 11.8304 18.1848 11.2156 17.6758L7.37738 14.4989C6.6113 13.8648 5.38245 13.8309 4.5671 14.4214L3.24316 15.3803"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
				</div>
			</svelte:fragment>
			<div class="min-w-16">
				<span>Camera</span>
			</div>
		</TabAnchor>

		<!-- ... -->
	</TabGroup>
	<svelte:fragment slot="trail">
		<div class="hidden sm:block">
			<LightSwitch />
		</div>
	</svelte:fragment>
</AppBar>
