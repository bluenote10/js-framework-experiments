<script lang="ts">
  import { push } from "./navigator.svelte";
  import SettingsView from "./SettingsView.svelte";
  import DetailView from "./DetailView.svelte";

  interface Props {
    title: string;
  }
  let { title }: Props = $props();

  type Article = {
    id: number;
    title: string;
    excerpt: string;
    bookmarked: boolean;
  };

  // Props down + events up demo: this $state is the single source of truth.
  // The snippet below passes it down to DetailView; DetailView's onToggleBookmark
  // callback mutates it back up. HomeView updates reactively even while it's
  // buried under a detail screen (it stays mounted, just inert).
  let articles = $state<Article[]>([
    {
      id: 1,
      title: "Svelte 5 Rune System",
      excerpt: "Deep dive into $state, $derived, $effect, and the new runes API.",
      bookmarked: false,
    },
    {
      id: 2,
      title: "View Transitions",
      excerpt: "Mobile-style screen transitions using Svelte snippets and fly().",
      bookmarked: false,
    },
    {
      id: 3,
      title: "Stack Navigation",
      excerpt: "Flutter-inspired navigation: the stack owns transitions, screens are passive.",
      bookmarked: false,
    },
  ]);
</script>

{#snippet settingsPage()}
  <SettingsView />
{/snippet}

<div class="view">
  <header>
    <h1>{title}</h1>
    <button class="icon-btn" onclick={() => push(settingsPage)} aria-label="Settings">⚙</button>
  </header>
  <main>
    <!--
      {#snippet} inside {#each}: each iteration captures its own `article`
      by reactive closure — no need to duplicate props as snippet parameters.
      Svelte still type-checks every prop at the definition site.
    -->
    {#each articles as article (article.id)}
      {#snippet detail()}
        <DetailView
          title={article.title}
          excerpt={article.excerpt}
          bookmarked={article.bookmarked}
          onToggleBookmark={() => (article.bookmarked = !article.bookmarked)}
        />
      {/snippet}
      <button class="article-row" onclick={() => push(detail)}>
        <div class="article-info">
          <span class="article-title">{article.title}</span>
          <span class="article-excerpt">{article.excerpt}</span>
        </div>
        <div class="article-meta">
          {#if article.bookmarked}
            <span class="bookmarked" aria-label="Bookmarked">★</span>
          {/if}
          <span class="chevron">›</span>
        </div>
      </button>
    {/each}
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px 12px;
    background: white;
    border-bottom: 1px solid #e0e0e0;
  }

  h1 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .icon-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 4px;
    color: #555;
  }

  main {
    flex: 1;
    overflow-y: auto;
  }

  .article-row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 16px 20px;
    background: white;
    border: none;
    border-bottom: 1px solid #e0e0e0;
    text-align: left;
    cursor: pointer;
  }

  .article-row:hover {
    background: #fafafa;
  }

  .article-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .article-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: #111;
  }

  .article-excerpt {
    font-size: 0.8rem;
    color: #888;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .article-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .bookmarked {
    color: #f59e0b;
    font-size: 1rem;
  }

  .chevron {
    color: #ccc;
    font-size: 1.2rem;
  }
</style>
