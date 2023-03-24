<script lang="ts">
	import type { Tag, Overflow } from '$lib/types';

	export let tag: Tag = 'div';
	export let flex: number | null = null;
	export let overflowX: Overflow | null = null;
	export let overflowY: Overflow | null = null;

	$: style =
		(flex != null ? `flex: ${flex}; ` : '') +
		(overflowX != null ? `overflow-x: ${overflowX}; ` : '') +
		(overflowY != null ? `overflow-y: ${overflowY}; ` : '');
</script>

<svelte:element this={tag} class="tag" {style}>
	<slot />
</svelte:element>

<style>
	.tag {
		display: flex;
		flex-direction: column;
		row-gap: var(--vbox-container-separation);

		border: 1px solid #aaa;
		/* background-color: aqua; */
	}
</style>
