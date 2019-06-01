import { createState, createEffect, onCleanup } from 'solid-js'

export function DoubleInterval() {
  const [state, setState] = createState({
    count: 0,
    delay: 1000,
  });

  createEffect(() => {
    console.log(`Setting up interval for 'count' with delay ${state.delay}`)
    const interval = setInterval(() =>
      setState({count: state.count + 1}), state.delay
    );
    onCleanup(() => {
      console.log("clearing interval for 'count'")
      clearInterval(interval)
    });
  })

  createEffect(() => {
    console.log("Setting up interval for 'delay'")
    const interval = setInterval(() =>
      setState({delay: state.delay / 2}), 1000
    );
    onCleanup(() => {
      console.log("clearing interval for 'delay'")
      clearInterval(interval)
    });
  })

  return (
    <>
      <div>Count: {(state.count)}</div>
      <div>Delay: {(state.delay)}</div>
      <button onclick={
        (event) => {
          console.log("clicked");
          setState({delay: 1000})
        }
      }>Reset delay</button>
    </>
  );
}
