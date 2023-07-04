import { useDispatch, useSelector } from "react-redux";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState, useMemo } from "react";
import { setDateFilter, setSymbolFilter } from "../redux/dataPacket";

export function SelectionBox() {
    const { puts, calls } = useSelector(state => state.dataPackets);
    const dispatch = useDispatch();
    const [optionSelected, setOptionSelected] = useState('');
    const [dateSelected, setDateSelected] = useState('');

    // Use useMemo to compute uniqueTradingNames memoized version
    const uniqueTradingNames = useMemo(() => {
        const all = [...puts, ...calls];
        return [...new Set(all.map(item => item.tradingName))];
    }, [puts, calls]);

    // Use useMemo to compute uniqueTradingNames memoized version
    const unquieDateValue = useMemo(() => {
        const all = [...puts, ...calls];
        return [...new Set(all.map(item => item.expiryDate))];
    }, [puts, calls]);

    const handleChange = (event) => {
        dispatch(setSymbolFilter(event.target.value));
        setOptionSelected(event.target.value);
    };

    const handleDateChange = (event) => {
        dispatch(setDateFilter(event.target.value));
        setDateSelected(event.target.value);
    };

    return (
        <>
            <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="demo-simple-select-autowidth-label">Symbol Name</InputLabel>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={optionSelected}
                    onChange={handleChange}
                    autoWidth
                    label="Select Symbol"
                >
                    <MenuItem value=''>None</MenuItem>

                    {uniqueTradingNames.map(e => {
                        return <MenuItem key={e} value={e}>{e}</MenuItem>;
                    })}
                </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="simple-select-autowidth-label">Expiry Date</InputLabel>
                <Select
                    labelId="simple-select-autowidth-label"
                    id="simple-select-autowidth"
                    value={dateSelected}
                    onChange={handleDateChange}
                    autoWidth
                    label="Select Date"
                >
                    <MenuItem value=''>None</MenuItem>
                    {unquieDateValue.map(e => {
                        return <MenuItem key={e} value={e}>{e}</MenuItem>;
                    })}
                </Select>
            </FormControl>
        </>
    );
}
