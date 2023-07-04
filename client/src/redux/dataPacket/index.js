import { createSlice } from "@reduxjs/toolkit";

const dataPacket = createSlice({
    name: 'datapacket',
    initialState: {
        originalPuts: [],
        originalCalls: [],
        puts: [],
        calls: [],
        filter_symbol: '',
        filter_date: ''
    },
    reducers: {
        setData: (state, { payload }) => {
            const newDataArray = payload;
            newDataArray.forEach((newData) => {
              const optionTypeArray = newData.OptionType === 'Calls' ? 'calls' : 'puts';
              const existingDataIndex = state[optionTypeArray].findIndex(
                (item) => item.tradingSymbol === newData.tradingSymbol
              );
              if (existingDataIndex !== -1) {
                // If the tradingSymbol already exists, update the existing data
                state[optionTypeArray][existingDataIndex] = newData;
              } else {
                // If the tradingSymbol does not exist, add the new data
                state[optionTypeArray].push(newData);
              }        
            });
          },
        
        setPutValue : (state, {payload})=>{
            state.puts = payload
        },
        setCallsValue : (state, {payload})=>{
            state.calls = payload
        },
        setSymbolFilter : (state, {payload})=>{
            state.filter_symbol = payload
        },
        setDateFilter: (state, {payload})=>{
            state.filter_date =  payload
        }
    }
});


export const {setData, setPutValue, setCallsValue, setDateFilter, setSymbolFilter} = dataPacket.actions
export default dataPacket.reducer