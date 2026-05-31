<script lang="ts">
  import { push } from "./navigator.svelte";
  import SettingsView from "./SettingsView.svelte";
  import DetailView from "./DetailView.svelte";
</script>

<div class="view">
  <header>
    <h1>Home</h1>
  </header>
  <main>
    <section>
      <h2>Navigate to</h2>
      <button onclick={() => push(SettingsView)}>Settings</button>
      <button onclick={() => push(DetailView, { title: "Article: Rune System" })}>
        Article: Rune System
      </button>
      <button onclick={() => push(DetailView, { title: "Article: Transitions" })}>
        Article: Transitions
      </button>
    </section>
  </main>
</div>

<style>
  .view {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f5f5;
  }

  header {
    padding: 16px 20px 12px;
    background: white;
    border-bottom: 1px solid #e0e0e0;
  }

  h1 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  main {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  h2 {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #888;
    margin: 0 0 8px;
  }

  button {
    padding: 14px 16px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    text-align: left;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.15s;
  }

  button:hover {
    background: #f0f0f0;
  }
</style>
