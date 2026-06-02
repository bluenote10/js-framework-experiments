<script lang="ts">
  import { pop } from "./navigator.svelte";

  interface Props {
    title: string;
    // Optional so this component can be used both as a rich article view
    // (from HomeView, with full props) and as a plain detail view (from
    // SettingsView, with only a title).
    excerpt?: string;
    bookmarked?: boolean;
    onToggleBookmark?: () => void;
  }
  let { title, excerpt, bookmarked = false, onToggleBookmark }: Props = $props();
</script>

<div class="view">
  <header>
    <button class="back-btn" onclick={() => pop()}>
      <span class="back-chevron">‹</span> Back
    </button>
    <h1>{title}</h1>
    {#if onToggleBookmark}
      <!--
        Events up: clicking calls onToggleBookmark(), which is a closure
        defined in HomeView that mutates HomeView's $state. Because HomeView
        stays mounted (just inert), its article list updates immediately —
        the ★ appears in the list before you even go back.
      -->
      <button
        class="bookmark-btn"
        class:active={bookmarked}
        onclick={onToggleBookmark}
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
      >
        {bookmarked ? "★" : "☆"}
      </button>
    {:else}
      <span></span>
    {/if}
  </header>
  <main>
    {#if excerpt}
      <p class="excerpt">{excerpt}</p>
    {/if}

    <section class="data-flow-note">
      <h2>How the data got here</h2>
      <dl>
        <dt>Props down</dt>
        <dd>
          <code>title</code>, <code>excerpt</code>, and <code>bookmarked</code> were passed through
          a <code>&#123;#snippet&#125;</code> closure defined inside a
          <code>&#123;#each&#125;</code> block in HomeView. Each list item gets its own closure — no snippet
          parameters needed; the variables are captured reactively from the loop.
        </dd>
        <dt>Events up</dt>
        <dd>
          <code>onToggleBookmark</code> is a callback prop:
          <code>() =&gt; (article.bookmarked = !article.bookmarked)</code>. Calling it mutates
          HomeView's <code>$state</code> directly. Because HomeView stays mounted (it's just
          <code>inert</code>), its list already shows the ★ before you tap Back.
        </dd>
      </dl>
    </section>
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
    padding: 0 8px;
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

  .bookmark-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #ccc;
    padding: 4px;
    justify-self: end;
    transition: color 0.15s;
  }

  .bookmark-btn.active {
    color: #f59e0b;
  }

  main {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .excerpt {
    margin: 0;
    font-size: 1rem;
    line-height: 1.6;
    color: #333;
    font-style: italic;
    border-left: 3px solid #e0e0e0;
    padding-left: 12px;
  }

  .data-flow-note {
    background: #f8f8f8;
    border-radius: 8px;
    padding: 16px;
  }

  h2 {
    margin: 0 0 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #888;
  }

  dl {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  dt {
    font-weight: 600;
    font-size: 0.85rem;
    margin-bottom: 2px;
  }

  dd {
    margin: 0;
    font-size: 0.8rem;
    color: #555;
    line-height: 1.5;
  }

  dd code {
    background: #ececec;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 0.75rem;
  }
</style>
