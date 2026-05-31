<script lang="ts">
  import { pop, push } from "./navigator.svelte";
  import DetailView from "./DetailView.svelte";

  let notifications = $state(true);
  let darkMode = $state(false);
  let syncEnabled = $state(true);
</script>

<div class="view">
  <header>
    <button class="back-btn" onclick={() => pop()}>
      <span class="back-chevron">‹</span> Back
    </button>
    <h1>Settings</h1>
  </header>
  <main>
    <section>
      <h2>Preferences</h2>

      <label class="row">
        <span>Notifications</span>
        <input type="checkbox" bind:checked={notifications} />
      </label>

      <label class="row">
        <span>Dark mode</span>
        <input type="checkbox" bind:checked={darkMode} />
      </label>

      <label class="row">
        <span>Background sync</span>
        <input type="checkbox" bind:checked={syncEnabled} />
      </label>
    </section>

    <section>
      <h2>Advanced</h2>
      <button class="nav-row" onclick={() => push(DetailView, { title: "Advanced Settings" })}>
        Advanced Settings
        <span class="chevron">›</span>
      </button>
      <button class="nav-row" onclick={() => push(DetailView, { title: "Privacy Policy" })}>
        Privacy Policy
        <span class="chevron">›</span>
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
    gap: 24px;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 1px;
    background: #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  }

  h2 {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #888;
    margin: 0 0 8px;
    background: transparent;
    padding: 0;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: white;
    font-size: 1rem;
    cursor: pointer;
  }

  .nav-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: white;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    text-align: left;
  }

  .nav-row:hover {
    background: #f5f5f5;
  }

  .chevron {
    color: #aaa;
    font-size: 1.2rem;
  }
</style>
