import { browser } from "$app/environment";
import type { Snippet } from "svelte";

export type RouteEntry = {
  id: number;
  content: Snippet;
};

let _nextId = 0;
let _stack = $state<RouteEntry[]>([]);

export function getStack(): RouteEntry[] {
  return _stack;
}

export function getActiveId(): number {
  return _stack.length > 0 ? _stack[_stack.length - 1].id : -1;
}

export function initialize(content: Snippet): void {
  _nextId = 0;
  _stack = [{ id: _nextId++, content }];
  // Annotate the existing history entry (replaceState, not pushState — we don't
  // want to add an entry, just label the one that's already there).
  if (browser) history.replaceState({ navigatorDepth: 1 }, "");
}

export function push(content: Snippet): void {
  _stack = [..._stack, { id: _nextId++, content }];
  if (browser) history.pushState({ navigatorDepth: _stack.length }, "");
}

export function pop(): void {
  if (_stack.length > 1) {
    _stack = _stack.slice(0, -1);
    // history.back() triggers popstate asynchronously. By the time it fires,
    // the stack is already at the correct depth, so syncToDepth() will be a
    // no-op — no double-pop risk.
    if (browser) history.back();
  }
}

export function canPop(): boolean {
  return _stack.length > 1;
}

// Called exclusively by the popstate listener in Navigator.svelte.
// Syncs the stack to match a history depth without touching history itself,
// which is what prevents the pop() ↔ popstate feedback loop.
export function syncToDepth(depth: number): void {
  while (_stack.length > depth) {
    _stack = _stack.slice(0, -1);
  }
}
