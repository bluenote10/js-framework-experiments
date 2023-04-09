<script lang="ts">
  import Wrapper from "./Wrapper.svelte";

  let data = [
    [1, false],
    [2, false],
    [3, true],
  ];
</script>

<p>This is a paragraph.</p>

<div>
  <ul>
    {#each data as [x, selected]}
      <li class:selected>Element {x}</li>
    {/each}
    {#each data as [x, selected]}
      <Wrapper><li class:selected>Element {x}</li></Wrapper>
    {/each}
  </ul>

  <section>Section A</section>
  <section>Section A</section>
</div>

<style>
  p {
    color: purple;
    font-family: monospace;
    font-size: 2em;
  }

  div {
    border: 1px solid #ccc;
  }

  li {
    color: green;
  }

  .selected {
    border: 1px solid darkgreen;
  }
</style>
