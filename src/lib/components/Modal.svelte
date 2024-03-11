<!-- Modal.svelte -->
<script lang="ts">
	export let imageUrl: string;
	export let onClose: () => void;
	export let title: string = ''; // Optional title prop

	function closeModal() {
		onClose();
	}

	// Close the modal when Escape key is pressed
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
</script>

<div class="modal-overlay" role="presentation" on:click={closeModal}>
	<div class="modal" role="dialog" aria-modal="true">
		<div class="modal-content" role="document">
			<button
				class="close"
				on:click={closeModal}
				aria-label="Close"
				on:keydown={handleKeyDown}
				tabindex="0">&times;</button
			>
			{#if title}
				<h2 class="modal-title">{title}</h2>
			{/if}
			<div class="image-container">
				<img src={imageUrl} alt="" class="modal-image" />
			</div>
			<!-- Remove alt attribute if not needed -->
			<slot />
		</div>
	</div>
</div>

<style>
	/* Modal styles */
	.modal-overlay {
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal {
		background-color: transparent;
		display: flex;
		justify-content: center;
	}

	.modal-content {
		max-width: 80%;
		max-height: 80%;
		overflow: auto;
		position: relative;
	}

	.modal-title {
		margin-top: 0;
	}

	.close {
		position: absolute;
		top: 10px;
		right: 15px;
		font-size: 28px;
		cursor: pointer;
		background: none;
		border: none;
		z-index: 1;
	}

	.close:hover {
		color: #000;
	}

	.image-container {
		display: flex;
		justify-content: center; /* Center horizontally */
		align-items: center;
		height: 100%;
	}

	.modal-image {
		max-width: 100%;
		max-height: 100%;
		cursor: pointer;
	}

	/* Add animation */
	@keyframes modalAnimation {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-content {
		animation: modalAnimation 0.3s;
	}
</style>
