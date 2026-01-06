<script lang="ts">
  import ComponentWithChildren from "./ComponentWithChildren.svelte";
  import ComponentWithParametrizedChildren from "./ComponentWithParametrizedChildren.svelte";
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

<hr />
<h3>Using ComponentWithParametrizedChildren (syntax option 1)</h3>
<!-- Syntax option with nested snippet. This is likely preferable, because the argument type seems inferred. -->
<ComponentWithParametrizedChildren>
  {#snippet parametrized({ text })}
    <div>Child 1 ({text})</div>
    <div>Child 2 ({text})</div>
  {/snippet}
</ComponentWithParametrizedChildren>

<hr />
<h3>Using ComponentWithParametrizedChildren (syntax option 2)</h3>
<!-- Syntax option pulled out snippet. Makes the snippet re-usable, but requires typing the argument. -->
{#snippet withData({ text }: { text: string })}
  <div>Child 1 ({text})</div>
  <div>Child 2 ({text})</div>
{/snippet}
<ComponentWithParametrizedChildren parametrized={withData} />
