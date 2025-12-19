import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentLanguage: 'hi',
};

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state, action) => {
            state.currentLanguage = action.payload;
        },
    },
});

export const { setLanguage } = languageSlice.actions;

// Selectors
export const selectCurrentLanguage = (state) => state.language.currentLanguage;

export default languageSlice.reducer;
