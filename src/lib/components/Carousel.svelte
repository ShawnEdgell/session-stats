<script>
	/**
	 * @type {HTMLDivElement}
	 */
	let elemCarousel;

	function carouselLeft() {
		const x =
			elemCarousel.scrollLeft === 0
				? elemCarousel.clientWidth * elemCarousel.childElementCount // loop
				: elemCarousel.scrollLeft - elemCarousel.clientWidth; // step left
		elemCarousel.scroll(x, 0);
	}

	function carouselRight() {
		const x =
			elemCarousel.scrollLeft === elemCarousel.scrollWidth - elemCarousel.clientWidth
				? 0 // loop
				: elemCarousel.scrollLeft + elemCarousel.clientWidth; // step right
		elemCarousel.scroll(x, 0);
	}
</script>

<div class="card p-4 grid grid-cols-[auto_1fr_auto] gap-4 items-center">
	<!-- Button: Left -->
	<button
		type="button"
		class="btn-icon variant-filled flex items-center justify-center"
		on:click={carouselLeft}
	>
		<!-- SVG Icon for Left Arrow -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
	</button>
	<!-- Full Images -->
	<div bind:this={elemCarousel} class="snap-x snap-mandatory scroll-smooth flex overflow-x-auto">
		<slot />
	</div>
	<!-- Button: Right -->
	<button
		type="button"
		class="btn-icon variant-filled flex items-center justify-center"
		on:click={carouselRight}
	>
		<!-- SVG Icon for Right Arrow -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
		</svg>
	</button>
</div>
