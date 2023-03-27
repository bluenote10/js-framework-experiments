<script>
  import VBox from "$lib/VBox.svelte";
  import HBox from "$lib/HBox.svelte";
  import MarginBox from "$lib/MarginBox.svelte";
</script>

<div>
  <p>This is a paragraph.</p>
  <button
    >Ok
    <div>subdiv</div></button
  >
</div>

<VBox>
  <div>A</div>
  <div>BBB</div>
  <div>C<br />C<br />C</div>
</VBox>

<HBox>
  <div>A</div>
  <div>BBB</div>
  <div>C<br />C<br />C</div>
</HBox>

<MarginBox>
  <div>A</div>
  <div>BBB</div>
  <div>C<br />C<br />C</div>
</MarginBox>

<div class="restyled">
  <VBox>
    <div>A</div>
    <div>BBB</div>
    <div>C<br />C<br />C</div>
  </VBox>

  <HBox>
    <div>A</div>
    <div>BBB</div>
    <div>C<br />C<br />C</div>
  </HBox>

  <MarginBox>
    <div>A</div>
    <div>BBB</div>
    <div>C<br />C<br />C</div>
  </MarginBox>
</div>

<style>
  div {
    color: #0f0;
    font-size: 20px;
  }
  p {
    color: purple;
    font-family: "Comic Sans MS", cursive;
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
