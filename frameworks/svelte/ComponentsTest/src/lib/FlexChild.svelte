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
