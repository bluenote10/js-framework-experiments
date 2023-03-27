<script lang="ts">
  import type { Tag, Flex, Overflow } from "$lib/types";
  import { flexComputeClassAndStyle } from "./utils";

  // General
  export let tag: Tag = "div";
  export let overflowX: Overflow | null = null;
  export let overflowY: Overflow | null = null;

  // Flex child
  export let flex: Flex | number | null = null;

  $: [clazz, style] = flexComputeClassAndStyle(flex, overflowX, overflowY);
</script>

<svelte:element this={tag} class={clazz} {style}>
  <slot />
</svelte:element>

<style>
  .self {
    display: inline-block;

    padding-top: var(--margin-container-top);
    padding-bottom: var(--margin-container-bottom);
    padding-left: var(--margin-container-left);
    padding-right: var(--margin-container-right);

    border: 1px solid #aaa;
  }
</style>
