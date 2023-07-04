import { useDispatch, useSelector } from "react-redux";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState, useMemo, useEffect } from "react";
import { setDateFilter, setSymbolFilter } from "../redux/dataPacket";

export function SelectionBox() {
    const { puts, calls } = useSelector(state => state.dataPackets);
    const dispatch = useDispatch();
    const [optionSelected, setOptionSelected] = useState('');
    const [dateSelected, setDateSelected] = useState('');

    // Use useMemo to compute uniqueTradingNames memoized version
    const uniqueTradingNames = useMemo(() => {
        const all = [...puts, ...calls];
        const tradingNames = [...new Set(all.map(item => item.tradingName))];
        const sortedTradingNames = tradingNames.sort((a, b) => a.localeCompare(b));
        return sortedTradingNames;
    }, [puts, calls]);

    // Use useMemo to compute uniqueTradingNames memoized version and sort the dates in ascending order
    const unquieDateValue = useMemo(() => {
        const all = [...puts, ...calls];
        const uniqueDates = [...new Set(all.map(item => item.expiryDate))];
        const filteredDates = uniqueDates.filter(date => date && date !== "void" && date !== "0");
        const sortedDates = filteredDates.sort((a, b) => new Date(a) - new Date(b));
        return sortedDates;

    }, [puts, calls]);

    useEffect(() => {
        // Auto-select the first date in the dropdown when the component mounts
        if (unquieDateValue.length > 0) {
            handleDateChange({ target: { value: unquieDateValue[0] } });
        }
    }, [unquieDateValue]);

    const handleChange = (event) => {
        dispatch(setSymbolFilter(event.target.value));
        setOptionSelected(event.target.value);
    };

    const handleDateChange = (event) => {
        dispatch(setDateFilter(event.target.value));
        setDateSelected(event.target.value);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
            <FormControl variant="outlined">
                <InputLabel htmlFor="symbol-select">Symbol Name</InputLabel>
                <Select
                    id="symbol-select"
                    value={optionSelected}
                    onChange={handleChange}
                    label="Select Symbol"
                    style={{ minWidth: '200px' }}
                >
                    <MenuItem value=''>
                        <em>All</em>
                    </MenuItem>
                    {uniqueTradingNames.map(e => (
                        <MenuItem key={e} value={e}>{e}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl variant="outlined">
                <InputLabel htmlFor="date-select">Expiry Date</InputLabel>
                <Select
                    id="date-select"
                    value={dateSelected}
                    onChange={handleDateChange}
                    label="Select Date"
                    style={{ minWidth: '200px' }}
                >
                    {unquieDateValue.map((e) => (
                        <MenuItem key={e} value={e}>{e}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
