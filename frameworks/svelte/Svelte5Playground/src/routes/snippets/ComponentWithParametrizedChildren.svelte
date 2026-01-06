<script lang="ts">
  import type { Snippet } from "svelte";

  // For parametrized children, it is no longer possible to use plain children (unnamed snippet):
  // https://github.com/sveltejs/svelte/issues/9974
  // Looks like a named snippet is mandatory. Note that things actually type check when given the
  // `children` prop a generic input argument type, but it is actually not usable.
  interface Props {
    parametrized: Snippet<[{ text: string }]>;
  }

  let { parametrized }: Props = $props();
</script>

{@render parametrized({ text: "foo" })}
