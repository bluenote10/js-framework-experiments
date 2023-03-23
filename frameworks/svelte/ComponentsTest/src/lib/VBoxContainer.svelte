<script lang="ts">
	export let flex: number | null = null;
</script>

<div class:flex={flex != null} style:--flex-value={flex}>
	<slot />
</div>

<style>
	div {
		display: inline-flex;
		flex-direction: column;
		row-gap: var(--vbox-container-separation);

		border: 1px solid #aaa;
		background-color: aqua;
	}

	.flex {
		flex: var(--flex-value);
	}
</style>
