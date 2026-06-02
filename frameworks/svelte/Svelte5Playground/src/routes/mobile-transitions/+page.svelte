<script lang="ts">
  import Navigator from "./Navigator.svelte";
  import MobileWrapper from "./MobileWrapper.svelte";
  import HomeView from "./HomeView.svelte";
</script>

{#snippet initialScreen()}
  <HomeView title="Home" />
{/snippet}

<MobileWrapper>
  <Navigator initial={initialScreen} />
</MobileWrapper>
