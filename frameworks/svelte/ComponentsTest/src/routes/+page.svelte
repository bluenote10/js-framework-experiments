<script>
	import VBoxContainer from '../lib/VBoxContainer.svelte';
	import HBoxContainer from '../lib/HBoxContainer.svelte';
	import '../styles.css';
	import MarginContainer from '../lib/MarginContainer.svelte';
</script>

<div>
	<p>This is a paragraph.</p>
	<button
		>Ok
		<div>subdiv</div></button
	>
</div>

<VBoxContainer>
	<div>A</div>
	<div>BBB</div>
	<div>C<br />C<br />C</div>
</VBoxContainer>

<HBoxContainer>
	<div>A</div>
	<div>BBB</div>
	<div>C<br />C<br />C</div>
</HBoxContainer>

<MarginContainer>
	<div>A</div>
	<div>BBB</div>
	<div>C<br />C<br />C</div>
</MarginContainer>

<div class="restyled">
	<VBoxContainer>
		<div>A</div>
		<div>BBB</div>
		<div>C<br />C<br />C</div>
	</VBoxContainer>

	<HBoxContainer>
		<div>A</div>
		<div>BBB</div>
		<div>C<br />C<br />C</div>
	</HBoxContainer>

	<MarginContainer>
		<div>A</div>
		<div>BBB</div>
		<div>C<br />C<br />C</div>
	</MarginContainer>
</div>

<style>
	div {
		color: #0f0;
		font-size: 20px;
	}
	p {
		color: purple;
		font-family: 'Comic Sans MS', cursive;
		font-size: 2em;
	}
	button {
		padding: 10px;
		color: #f00;
		font-size: 30px;
	}

	.restyled {
		--vbox-container-separation: 16px;
		--hbox-container-separation: 16px;

		--margin-container-top: 16px;
		--margin-container-bottom: 16px;
		--margin-container-left: 16px;
		--margin-container-right: 16px;
	}
</style>
