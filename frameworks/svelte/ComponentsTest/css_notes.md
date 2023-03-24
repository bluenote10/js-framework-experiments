
# How to achive "100% height"

The issue with setting `height: 100%`:
- Basically an entire chain from `html` => `body` => `div` => ... > `div` may require
  setting `height: 100%` to propagate it down.
- If e.g. the body should contain another element that uses up a certain fraction of
  the 100%, the problem rather turns into "use up all the remaining space". Just setting
  `height: 100%` no longer works, because the total height would be > 100%, and our goal
  rather is to end up with exactly 100% **in total**.

Especially the second aspects suggest to use `flex`, which provides exactly this
"use up all remaining space" by setting that child to flex and grow.


# How to avoid that a flex column container get "too high" due to its children becoming too high (i.e. limit the height and scroll instead)?

This seems to be a very common question:

- https://stackoverflow.com/questions/21515042/scrolling-a-flexbox-with-overflowing-content
- http://geon.github.io/programming/2016/02/24/flexbox-full-page-web-app-layout

The possibility I tried first was to use `overflow-y: scroll` (or `auto`) on the parent.

- http://jsfiddle.net/8sj0wpau/2/