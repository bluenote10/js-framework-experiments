import { createState, createEffect, onCleanup } from 'solid-js'

import { DoubleInterval } from "./DoubleInterval"

function CountingComponent(props) {
  const [state, setState] = createState({counter: 0});

  createEffect(() => {

  })
  const interval = setInterval(() =>
    setState({counter: state.counter + 1})
  , 1000);

  onCleanup(() => clearInterval(interval));

  return <div>{(state.counter)}</div>;
}


function Dropbox(props) {
  console.log("Rendering item:", props);
  createEffect(() => console.log("Updated items:", props.items));
  createEffect(() => console.log("Updated selectedIndex:", props.selectedIndex));

  return (
    <div>
      <div>Selected index: {(props.selectedIndex != undefined ? props.selectedIndex : "")}</div>
      {/*<div>Selected: {(props.selectedIndex != undefined ? props.items[props.selectedIndex] : "")}</div>*/}
      {/*<div>Selected: {(props.selectedIndex != undefined && props.items[props.selectedIndex])}</div>*/}
      <ul>
        {(props.items.map((item, index) =>
          <li>
            <a onclick={(event) => {
              console.log("clicked li")
              //props.selected.set(item)
              //props.selected = item
              props.onselect(index)
            }}>
              {item} {(props.selectedIndex === index) ? "[selected]" : ""}
            </a>
          </li>)
        )}
      </ul>
    </div>
  )
}

/*
function App() {
  console.log("rendering app");

  const [state, setState] = createState({
    items: ["A", "B", "C"],
    selectedIndex: undefined,
  });

  return (
    <>
      <Debug/>
      <CountingComponent/>
      <div class="App">
        <Dropbox items={(state.items)} selectedIndex={(state.selectedIndex)} onselect={(index) => setState({selectedIndex: index})}>
          <li>1</li>
          <li>2</li>
        </Dropbox>
      </div>
      <button onclick={
        (event) => {
          console.log("clicked");
          //setState(state => {items: state.items + ["new"]})
          //setState({items: [...state.items, "new"]})
          //setState("items", [...state.items, "new"])
          setState({selectedIndex: undefined})
        }
      }>Click me</button>
      <button onclick={
        (event) => {
          console.log("clicked");
          //setState(state => {items: state.items + ["new"]})
          //setState({items: [...state.items, "new"]})
          setState("selected", "B")
        }
      }>Click me</button>
    </>
  );
}
*/

import { Effects } from "./Effects";
function App() {
  return <Effects/>
}



/*
function ItemRenderer(props) {
  console.log("Rendering item:", props);
  createEffect(() => console.log("Rendering item:", props.item));
  let { item } = props.item;
  return (
    <div>
      {("Item: " + item)}
    </div>
  )
}

function App() {
  console.log("Rendering app");
  const [state, setState] = createState({item: "init value"});

  return (
    <div>
      <ItemRenderer item={(state.item)}/>
      <button onclick={
        (event) => {
          console.log("Modifying state");
          setState({item: "modified value"})
        }
      }>Modify State</button>
    </div>
  );
}
*/

export default App;
