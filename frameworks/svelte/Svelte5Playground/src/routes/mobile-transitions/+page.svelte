<script lang="ts">
  import { onMount } from "svelte";
  import Navigator from "./Navigator.svelte";
  import MobileWrapper from "./MobileWrapper.svelte";
  import HomeView from "./HomeView.svelte";
  import { initialize } from "./navigator.svelte";

  onMount(() => {
    initialize(HomeView);
  });
</script>

<MobileWrapper>
  <Navigator />
</MobileWrapper>
