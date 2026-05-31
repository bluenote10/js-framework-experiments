import type { Component } from "svelte";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyComponent = Component<any, any, any>;

export type RouteEntry = {
  id: number;
  component: AnyComponent;
  props: Record<string, unknown>;
};

let _nextId = 0;
let _stack = $state<RouteEntry[]>([]);

export function getStack(): RouteEntry[] {
  return _stack;
}

export function getActiveId(): number {
  return _stack.length > 0 ? _stack[_stack.length - 1].id : -1;
}

export function initialize(root: AnyComponent, props: Record<string, unknown> = {}): void {
  _nextId = 0;
  _stack = [{ id: _nextId++, component: root, props }];
}

export function push(component: AnyComponent, props: Record<string, unknown> = {}): void {
  _stack = [..._stack, { id: _nextId++, component, props }];
}

export function pop(): void {
  if (_stack.length > 1) {
    _stack = _stack.slice(0, -1);
  }
}

export function canPop(): boolean {
  return _stack.length > 1;
}
