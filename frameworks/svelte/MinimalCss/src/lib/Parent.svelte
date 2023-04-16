<script lang="ts">
  import Child from "./Child.svelte";
</script>

<p>This is a paragraph in the parent.</p>

<div>This is a div in the parent.</div>

<ul>
  <li class:selected={false}>Item 1</li>
  <li class:selected={true}>Item 2</li>
  <li class:selected={false}>Item 3</li>
</ul>

<Child>
  <p>This paragraph comes from the parent, and accordingly is styled according to parent styles.</p>
</Child>

<Child>
  <p>This paragraph comes from the parent, and accordingly is styled according to parent styles.</p>
</Child>

<style>
  p {
    color: darkblue;
  }

  div {
    border: 1px solid darkblue;
  }

  ul {
    margin: 16px;
  }

  li {
    border: 1px solid green;
  }

  .selected {
    background-color: lightblue;
  }
</style>
