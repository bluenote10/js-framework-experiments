<div>
	<slot />
</div>

<style>
	div {
		display: inline-flex;
		flex-direction: column;
		row-gap: var(--vbox-container-separation);

		border: 1px solid #aaa;
	}
</style>
