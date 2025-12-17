import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pageIndex: 0,
    pageSize: 10,
    columnFilters: [],
    sorting: [],
};

const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        setPageIndex: (state, action) => {
            state.pageIndex = action.payload;
        },
        setPageSize: (state, action) => {
            state.pageSize = action.payload;
            state.pageIndex = 0; // Reset to first page when changing page size
        },
        setColumnFilters: (state, action) => {
            state.columnFilters = action.payload;
            state.pageIndex = 0; // Reset to first page when filtering
        },
        setSorting: (state, action) => {
            state.sorting = action.payload;
        },
        resetTable: (state) => {
            Object.assign(state, initialState);
        },
    },
});

export const {
    setPageIndex,
    setPageSize,
    setColumnFilters,
    setSorting,
    resetTable,
} = tableSlice.actions;

export default tableSlice.reducer;
