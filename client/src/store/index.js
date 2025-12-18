import { configureStore } from '@reduxjs/toolkit';
import tableReducer from './slices/tableSlice';
import sidebarReducer from './slices/sidebarSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        table: tableReducer,
        sidebar: sidebarReducer,
        auth: authReducer,
    },
});

export default store;
