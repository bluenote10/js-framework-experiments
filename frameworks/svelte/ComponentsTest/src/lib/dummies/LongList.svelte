<script>
  import HBoxContainer from "$lib/HBoxContainer.svelte";
  import VBoxContainer from "$lib/VBoxContainer.svelte";
  let data = Array.from(Array(100).keys());
</script>

<VBoxContainer tag="ul">
  {#each data as x}
    <HBoxContainer tag="li" flex={x}>Element {x}</HBoxContainer>
  {/each}
</VBoxContainer>

<ul>
  {#each data as x}
    <li>Element {x}</li>
  {/each}
</ul>
