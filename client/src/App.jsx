import { useEffect } from 'react'
import './App.css'
import { WebSocketConnection } from './service/websocket'
import PutsTable from './components/putsTableVirual'
import CallsTable from './components/callsTableVirtual'
import { SelectionBox } from './components/SelectionBar'

function App() {

  useEffect(() => {

  }, [])
  return (
    <>
      <WebSocketConnection />
      <SelectionBox />
      <div style={{display:'flex', margin: '10rem 2rem'}}>
        <PutsTable />
        <CallsTable />
      </div>
    </>
  )
}

export default App
