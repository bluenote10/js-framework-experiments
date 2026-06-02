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
}

export function push(content: Snippet): void {
  _stack = [..._stack, { id: _nextId++, content }];
}

export function pop(): void {
  if (_stack.length > 1) {
    _stack = _stack.slice(0, -1);
  }
}

export function canPop(): boolean {
  return _stack.length > 1;
}
