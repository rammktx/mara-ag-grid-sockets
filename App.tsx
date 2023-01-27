import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

export default function App() {
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    { field: 'make', sortable: true, filter: true },
    { field: 'model', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true },
  ]);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    'wss://ws.coincap.io/prices?assets=bitcoin',
    {
      //onOpen: () => sendJsonMessage({'assets': 'bitcoin'})
    }
  );

  useEffect(() => {
    //console.log(lastJsonMessage);
    if (lastJsonMessage)
      setRowData([
        { make: 'Crypto', model: 'Bitcoin', price: lastJsonMessage['bitcoin'] },
        ...rowData,
      ]);
  }, [lastJsonMessage]);
  
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
    }),
    []
  );

  const cellClickedListener = useCallback((event) => {
    console.log('cellClicked', event);
  }, []);

  const buttonListener = useCallback((e) => {
    gridRef.current.api.deselectAll();
  }, []);

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/row-data.json')
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);
  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <button onClick={buttonListener}>Clear Selections</button>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection="multiple"
        animateRows={true}
        onCellClicked={cellClickedListener}
        ref={gridRef}
      />
    </div>
  );
}
