<script>
  import VBox from "$lib/VBox.svelte";
  import HBox from "$lib/HBox.svelte";
  import FlexChild from "$lib/FlexChild.svelte";

  let n = 64;

  $: data = Array.from(Array(n).keys());

  const increase = () => {
    n *= 2;
  };
  const decrease = () => {
    n /= 2;
    if (n < 1) {
      n = 1;
    }
  };
</script>

<HBox>
  <button on:click={increase}>more</button>
  <button on:click={decrease}>less</button>
</HBox>
<VBox tag="ul">
  {#each data as x}
    <FlexChild tag="li" flex={x}>Element {x}</FlexChild>
  {/each}
</VBox>
