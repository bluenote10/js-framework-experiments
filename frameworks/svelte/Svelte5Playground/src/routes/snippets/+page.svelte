<script lang="ts">
  import ComponentWithChildren from "./ComponentWithChildren.svelte";
</script>

<hr />
<h3>Using ComponentWithChildren without children</h3>
<ComponentWithChildren />

<hr />
<h3>Using ComponentWithChildren with children</h3>
<ComponentWithChildren>
  <div>Child 1</div>
  <div>Child 2</div>
</ComponentWithChildren>
