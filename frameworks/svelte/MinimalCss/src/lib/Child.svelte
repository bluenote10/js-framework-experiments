<script lang="ts">
  let selected = false;
</script>

<div class:selected>
  <p>This is a paragraph in the child.</p>

  <slot />

  <p>Selected: {selected}</p>

  <button on:click={() => (selected = !selected)}>Toggle</button>
</div>

<style>
  p {
    color: seagreen;
  }

  div {
    border: 1px solid seagreen;
  }

  .selected {
    background-color: lightgreen;
  }
</style>
