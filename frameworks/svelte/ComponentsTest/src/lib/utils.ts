import type { Flex, Overflow } from "$lib/types";

export function nullify(s: string): string | null {
  if (s.length == 0) {
    return null;
  } else {
    return s;
  }
}

export function join(...args: Array<string | null | undefined>): string | null {
  let s = "";
  for (const arg of args) {
    if (arg != null) {
      s += arg + " ";
    }
  }
  return nullify(s);
}

export function flexComputeClassAndStyle(
  flex: Flex | number | null,
  overflowX: Overflow | null,
  overflowY: Overflow | null,
): [string, string | null] {
  if (flex === 1) {
    flex = "1";
  }

  let clazz = "self ";
  let style = "";

  if (typeof flex === "string") {
    clazz += `flex-${flex} `;
  } else {
    style += `flex: ${flex}; `;
  }

  if (overflowX != null) {
    clazz += `overflow-x-${overflowX} `;
  }
  if (overflowY != null) {
    clazz += `overflow-y-${overflowY} `;
  }

  return [clazz, nullify(style)];
}
