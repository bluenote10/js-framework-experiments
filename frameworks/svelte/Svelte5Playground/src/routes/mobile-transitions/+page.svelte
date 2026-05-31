<script lang="ts">
  import { onMount } from "svelte";
  import Navigator from "./Navigator.svelte";
  import HomeView from "./HomeView.svelte";
  import { initialize } from "./navigator.svelte";

  onMount(() => {
    initialize(HomeView);
  });
</script>

<div class="root">
  <Navigator />
</div>

<style>
  .root {
    position: fixed;
    inset: 0;
  }
</style>
