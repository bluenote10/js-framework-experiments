import { createRoot, createState, createEffect, onCleanup } from 'solid-js';

function Effects() {
  const [state, setState] = createState({
    a: 10,
    b: 20,
    dependsOn: "a",
  })

  createEffect(() => {
    console.log("Effect without any dependency.")
    onCleanup(() => {
      console.log("Cleanup with no dependency")
    })
  })

  createEffect(() => {
    console.log("Updated a:", state.a)
    onCleanup(() => {
      console.log("Cleanup with a dependency")
    })
  })
  createEffect(() => {
    console.log("Updated b:", state.b)
    onCleanup(() => {
      console.log("Cleanup with b dependency")
    })
  })
  createEffect(() => {
    console.log("Updated a or b:", state.a, state.b)
    onCleanup(() => {
      console.log("Cleanup with a+b dependency")
    })
  })

  createEffect(() => {
    console.log("Accessing state.a from within a dead branch...")
    if (false) {
      console.log("[DEAD] Updated a:", state.a)
    }
  })

  createEffect(() => {
    if (state.dependsOn === "a") {
      console.log("Effect depending on a:", state.a)
    } else {
      console.log("Effect depending on b:", state.b)
    }
  })

  function toggleDependsOn() {
    state.dependsOn === "a" ? setState({dependsOn: "b"}) : setState({dependsOn: "a"})
  }

  return (
    <div>
      <div>a = {(state.a)}</div>
      <div>b = {(state.b)}</div>
      <div>depends on = {(state.dependsOn)}</div>
      <button onclick={() => setState({a: state.a + 1})}>Inc a</button>
      <button onclick={() => setState({b: state.b + 1})}>Inc b</button>
      <button onclick={() => toggleDependsOn()}>Toggle depends on</button>
    </div>
  )
}

function App() {
  return (
    <div>
      Hello World
      <Effects/>
    </div>
  )
}


let el = document.getElementById('root')!;
createRoot(() => el.appendChild(<App/>));
