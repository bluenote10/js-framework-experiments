import { createRoot, createState, createEffect, onCleanup } from 'solid-js';


type Proxy<T extends any> = T & {
  get(): any,
  set(): boolean
};

/*
const x: Proxy<number[]> = {} as Proxy<number[]>
const l = x.length
x[0] = 0
*/

/*
interface Data {
  x: number,
  y: number,
}

function MyComponent(props: {data: Data}) {
  return <div>...</div>
}

function test() {

  const [state, setState] = createState({
    data: {
      x: 1,
      y: 2,
    },
    data2: [1, 2, 3]
  })
  let x = state.data2

  return <MyComponent data={(state.data) as any as Data}/>
}
*/

export type Wrapped<T> = {
  [P in keyof T]: T[P] extends object ? Wrapped<T[P]> : T[P];
} & { _state: T }

function wrap<T extends {}>(value: T): Wrapped<T> {
  return value as Wrapped<T>;
}

{
  const x = wrap([1, 2, 3])
  const l = x.length
  const xArr = x as number[]
  x[0] = 0
}
{
  const x = wrap({a: 1})
  const a = x.a
}
{
  const x = wrap({data: {a: 1}})
  const a = x.data
}
{
  const x = wrap({data: [1, 2, 3]})
  const a = x.data
}


function MyComponent(props: {data: number[]}) {
  return <div>...</div>
}

export function Typed() {
  const [state, setState] = createState({
    data: [1, 2, 3]
  })

  //console.log(state.data.get())
  console.log(state.data.set())

  let x = (state.data as any as number[])[0]
  return <MyComponent data={(state.data) as any as number[]}/>
}