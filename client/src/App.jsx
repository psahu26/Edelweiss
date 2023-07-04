import { useEffect } from 'react';
import './App.css';
import { WebSocketConnection } from './service/websocket';
import PutsTable from './components/putsTableVirual';
import CallsTable from './components/callsTableVirtual';
import { SelectionBox } from './components/SelectionBar';
import { Grid } from '@mui/material';

function App() {
  useEffect(() => {
    // Your useEffect logic goes here if needed
  }, []);

  return (
    <>
      <WebSocketConnection />
      <SelectionBox />
      <Grid container spacing={0} style={{ padding: '0rem 3rem' }}>
        <Grid item xs={6}>
          <PutsTable />
        </Grid>
        <Grid item xs={6}>
          <CallsTable />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
