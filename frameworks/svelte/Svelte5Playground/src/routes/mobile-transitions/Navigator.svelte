<script lang="ts">
  import { getStack, getActiveId } from "./navigator.svelte";
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  let navEl = $state<HTMLElement | null>(null);
  let navWidth = $state(390);

  const stack = $derived(getStack());
  const activeId = $derived(getActiveId());

  $effect(() => {
    if (navEl) {
      navWidth = navEl.clientWidth;
    }
  });
</script>

<div class="navigator" bind:this={navEl}>
  {#each stack as route, i (route.id)}
    {@const RouteComponent = route.component}
    <div
      class="route"
      style:z-index={i}
      inert={route.id !== activeId ? true : undefined}
      in:fly={{
        x: i === 0 ? 0 : navWidth,
        duration: i === 0 ? 0 : 300,
        opacity: 1,
        easing: cubicOut,
      }}
      out:fly={{ x: navWidth, duration: 300, opacity: 1, easing: cubicOut }}
    >
      <RouteComponent {...route.props} />
    </div>
  {/each}
</div>

<style>
  .navigator {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .route {
    position: absolute;
    inset: 0;
    background: white;
  }
</style>
