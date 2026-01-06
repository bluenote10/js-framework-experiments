<script lang="ts">
  import type { Snippet } from "svelte";

  // Optional children are possible by using `?` and then guarding the `@render` call
  // below behind a conditional.
  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
</script>

<div>ComponentWithChildren</div>

<p>Rendering children (first time)...</p>
{#if children}
  {@render children()}
{/if}

<p>Rendering children (second time)...</p>
{#if children}
  {@render children()}
{/if}
