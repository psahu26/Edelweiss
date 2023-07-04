/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';

export const tableHeaderColumns = [
    {
        width: 20,
        label: 'Strike Price',
        dataKey: 'strikePrice',
        numeric: true,
    },
    {
        width: 50,
        label: 'Open Interest',
        dataKey: 'openInterest',
        numeric: true,
    },
    {
        width: 20,
        label: 'Volume',
        dataKey: 'volume',
        numeric: true,
    },
    {
        width: 20,
        label: 'Last Traded Price',
        dataKey: 'lastTradedPrice',
        numeric: true,
    },
    {
        width: 20,
        label: 'Bid Quantity',
        dataKey: 'bidQuantity',
        numeric: true,
    },
    {
        width: 20,
        label: 'Bid Price',
        dataKey: 'bidPrice',
        numeric: true,
    },
    {
        width: 20,
        label: 'Ask Price',
        dataKey: 'askPrice',
        numeric: true,
    },
    {
        width: 20,
        label: 'Ask Quantity',
        dataKey: 'askQuantity',
        numeric: true,
    },
    {
        width: 20,
        label: 'Expiry Date',
        dataKey: 'expiryDate',
        numeric: false,
    },
 
    {
        width: 20,
        label: 'COI',
        dataKey: 'coi',
        numeric: true,
    },
    {
        width:20,
        label: 'Change',
        dataKey: 'change',
        numberic: true
    },
    {
        width:20,
        label: 'Implied Volatility',
        dataKey: 'impliedVolatility',
        numberic: true
    }
];

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead,
  // eslint-disable-next-line no-unused-vars
  TableRow: ({ item: _item, ...props }) => {
    return <TableRow {...props} style={_item.strikePrice > _item.lastTradedPrice ? {background: 'rgba(255, 148, 112)'}: {}} />

  },
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {tableHeaderColumns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? 'right' : 'left'}
          style={{ width: column.width }}
          sx={{
            backgroundColor: 'background.paper',
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index, row) {
  return (
    <React.Fragment>
       
      {tableHeaderColumns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? 'right' : 'left'}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
   
    </React.Fragment>
  );
}


export default function CallsTable() {
    const { calls, filter_symbol, filter_date } = useSelector((state) => state.dataPackets);
    const [rows, setRows] = useState(calls);

    useEffect(() => {
        let filteredRows = calls;

        // Update rows when filter_symbol or selectedDate changes
        if (filter_symbol) {
            filteredRows = filteredRows.filter((put) => put.tradingName === filter_symbol);
        }
        if (filter_date) {
            filteredRows = filteredRows.filter((put) => put.expiryDate === filter_date);
        }

        
        // Sorting based on the 'strikePrice' column
        filteredRows = orderBy(filteredRows, ['strikePrice'], ['asc']);
        setRows(filteredRows)

    }, [filter_symbol, filter_date, calls]);

    return (
        <Paper style={{ height: 1000, width: '100%' }}>
              <div style={{textAlign: 'center', margin: '10px', border: '2px solid black'}}>
                Calls Table
            </div>
            <TableVirtuoso
                data={rows}
                components={VirtuosoTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={rowContent}
            />
        </Paper>
    );
}