<script lang="ts">
  import { pop } from "./navigator.svelte";

  interface Props {
    title: string;
  }
  let { title }: Props = $props();

  const paragraphs = [
    "This is a detail screen pushed onto the navigation stack. The previous screen is still mounted in the DOM — it just has the inert attribute, which blocks pointer events and focus without affecting visual rendering.",
    "When you tap the back button, this view plays an out:fly transition sliding to the right, while the screen beneath it is already in place.",
    "The Navigator component does all the orchestration: it keeps multiple route divs in the DOM, assigns z-index by stack position, and sets inert on everything except the top route.",
    "This architecture closely mirrors Flutter's Navigator widget — individual screens are passive content, and the navigation system owns timing, animation, and interaction blocking.",
  ];
</script>

<div class="view">
  <header>
    <button class="back-btn" onclick={() => pop()}>
      <span class="back-chevron">‹</span> Back
    </button>
    <h1>{title}</h1>
  </header>
  <main>
    {#each paragraphs as paragraph, i (i)}
      <p>{paragraph}</p>
    {/each}
  </main>
</div>

<style>
  .view {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
  }

  header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 12px 16px;
    background: white;
    border-bottom: 1px solid #e0e0e0;
  }

  h1 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 2px;
    background: none;
    border: none;
    color: #2196f3;
    font-size: 1rem;
    cursor: pointer;
    padding: 4px 0;
  }

  .back-chevron {
    font-size: 1.4rem;
    line-height: 1;
    margin-top: -2px;
  }

  main {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  p {
    margin: 0;
    line-height: 1.6;
    color: #333;
  }
</style>
