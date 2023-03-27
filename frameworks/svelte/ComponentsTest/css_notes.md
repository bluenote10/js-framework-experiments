
# Problems

## How to achieve "100% height"

The issue with setting `height: 100%`:
- Basically an entire chain from `html` => `body` => `div` => ... > `div` may require
  setting `height: 100%` to propagate it down.
- If e.g. the body should contain another element that uses up a certain fraction of
  the 100%, the problem rather turns into "use up all the remaining space". Just setting
  `height: 100%` no longer works, because the total height would be > 100%, and our goal
  rather is to end up with exactly 100% **in total**.

Especially the second aspects suggest to use `flex`, which provides exactly this
"use up all remaining space" by setting that child to flex and grow.


## How to avoid that a flex column container get "too high" due to its children becoming too high (i.e. limit the height and scroll instead)?

This seems to be a very common question:

- https://stackoverflow.com/questions/21515042/scrolling-a-flexbox-with-overflowing-content
- http://geon.github.io/programming/2016/02/24/flexbox-full-page-web-app-layout

The possibility I tried first was to use `overflow-y: scroll` (or `auto`) on the parent.

- http://jsfiddle.net/8sj0wpau/2/


## Does it make sense to make a `<ul>` or `<ol>` an flex parent?

Probably fine. Only making the `<li>` children themselves flex parent (rows) has the
unexpected side effect that setting `display: flex` on them results in removing the
bullet point, i.e., effectively triggering `list-style: none;`. This can be worked
around by either:
- Using the `<li>` purely as a flex child, and opening another flex parent inside it for the row.
  The drawback of that is that the overall DOM size increases because of the extra element.
- Re-introducing the bullet point via manual CSS (`li:before`).

See: https://stackoverflow.com/questions/66888427/if-the-li-element-is-a-flexbox-then-the-bullet-will-not-show



# General inspiration:

Article on the issues of CSS-in-JS by one of the Emotion developers:
https://dev.to/srmagura/why-were-breaking-up-wiht-css-in-js-4g9b


# Design notes

## CSS inline style vs utility classes?

Initially I was mainly using inline styles for dynamic styling:

```ts
$: style =
  (flex != null ? `flex: ${flex}; ` : '') +
  (overflowX != null ? `overflow-x: ${overflowX}; ` : '') +
  (overflowY != null ? `overflow-y: ${overflowY}; ` : '');
```

Due to the concern of performance impact of inline style (mentioned in the 'Why not CSS-in-JS'
post), I'm now trying to rather use a small set of CSS utility classes. The goal would be to
cover the majority of use cases with utility classes so that the `style` tag doesn't have to
be set in all standard use cases, and only fall back to `style` occasionally.


## CSS utility classes "via typed props" or "via string classes"?

Basically there are two ways to pass the utility classes:

```tsx
// via typed props:
<Component overflow-y="auto" flex="1"></Component>

// via string classes:
<Component classes="overflow-y-auto flex-one"></Component>
```

Pros of string classes:
- Close to raw tailwind classes
- More performant in standard cases, because class/style strings don't have to be assembled at runtime.

Cons of string classes:
- No type-safety
- No (good) auto-completion and discovery (unless fully relying on tailwind tooling + IDE plugins).
- Arguably less readable
- Awkward to handle cases that don't have a tailwind class (e.g. `flex={2}`). Assembling the `class` + `style`
  internally allows to offer a unified interface which internally mixes classes and fallback style.