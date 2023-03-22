<div>
	<slot />
</div>

<style>
	div {
		display: inline-flex;
		flex-direction: row;
		column-gap: var(--hbox-container-separation);

		border: 1px solid #aaa;
	}
</style>
