<script>
	let data = Array.from(Array(100).keys());
</script>

<ul>
	{#each data as x}
		<li>Element {x}</li>
	{/each}
</ul>
