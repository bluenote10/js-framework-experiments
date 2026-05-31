<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }
  let { children }: Props = $props();
</script>

<div class="shell">
  <div class="content">
    {@render children()}
  </div>
</div>

<style>
  /* ── Mobile: fill the viewport exactly ── */
  @media (max-width: 639px) {
    .shell {
      position: fixed;
      inset: 0;
    }

    .content {
      width: 100%;
      height: 100%;
    }
  }

  /* ── Desktop: floating card on a background ── */
  @media (min-width: 640px) {
    .shell {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100dvh;
      background:
        radial-gradient(ellipse at 20% 50%, hsl(220 60% 18%) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 20%, hsl(260 50% 22%) 0%, transparent 55%), hsl(225 35% 10%);
    }

    .content {
      width: 390px;
      height: min(844px, 90dvh);
      border-radius: 12px;
      overflow: hidden;
      box-shadow:
        0 0 0 1px hsl(220 30% 30% / 0.4),
        0 24px 64px hsl(220 60% 5% / 0.7),
        0 8px 24px hsl(220 60% 5% / 0.4);
    }
  }
</style>
