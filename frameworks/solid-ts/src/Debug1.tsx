import { createRoot, createState, createEffect, onCleanup } from 'solid-js';

function Debug() {

  const [state, setState] = createState({
    rowsData: [] as string[][],

  })

  /*
  createEffect(() => {
    console.log("Data updated", props.data)
    console.log("Data updated", props.data.length)
    const data = props.data
    if (data.length == 0) {
      return;
    }

    const numCols = data.length;
    const numRows = data[0].values.length;
    console.log(numRows, numCols);

    // we need to convert from columnar to row-wise data
    let rowsData = Array(numRows);
    for (let i=0; i<numRows; i++) {
      let rowData = Array(numCols);
      for (let j=0; j<numCols; j++) {
        rowData[j] = data[j].values[i].toString();
      }
      rowsData[i] = rowData;
    }
    console.log(rowsData);

    setState({rowsData: rowsData})
    / *
    let headerData: ThUpdate[] = data.map((x: TableData) => ({
      value: x.columnName,
      sortKind: x.sortKind,
      onsort: () => { this.props.onsort(x.columnName) }
    }))
    * /

  })
  */
  createEffect(() => {
    setTimeout(() => {
      setState({rowsData: [["1", "A"], ["2", "B"]]})
    }, 100)
  })



  createEffect(() => {
    console.log("Rowsdata updated", state.rowsData)
  })

  /*
  return (
    <table>
      <thead>
      </thead>
      <tbody>
        {(state.rowsData.map(row => <div>{row.toString()}</div>))}
      </tbody>
    </table>
  )
  */
  return (
    <table>
      <thead>

      </thead>
      <tbody>
        <$ each={(state.rowsData)} fallback={(<div>empty</div>)}>
          { (row: string[]) => {
            <td>{row.toString()}</td>
          }}
        </$>
      </tbody>
    </table>
  )
  return (
    <table>
      <thead>

      </thead>
      <tbody>
        <$ each={state.rowsData} fallback={<div>empty</div>}>
          { (row: string[]) => {
            <$ each={row} fallback={<div>empty</div>}>
              { (item: string) => {
                <td>{item}</td>
              }}
            </$>
          }}
        </$>
      </tbody>
    </table>
  )
  /*
  return (
    <table>
      <thead>

      </thead>
      <tbody>
        {state.rowsData.map(row => <div>{row.toString()}</div>)}
      </tbody>
    </table>
  )
  */
}
