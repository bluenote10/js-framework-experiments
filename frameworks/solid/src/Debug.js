import { createRoot, createState, createEffect, onCleanup } from 'solid-js';

export function Debug() {

  const [state, setState] = createState({
    data: [],
  })

  createEffect(() => {
    setTimeout(() => {
      setState({data: ["A", "B"]})
    }, 100)
  })

  return (
    <div>
      {[
        null,
        null,
        null,
      ]}
    </div>
  )

  return (
    <div>
      {(state.data.map(item => <div>{item}</div>))}
    </div>
  )

  return (
    <div>
      <$ each={(state.data)}>
        { item => {
         return <div>{item}</div>
        }}
      </$>
    </div>
  )
}
