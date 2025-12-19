import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Load initial state from localStorage
const loadAuthFromStorage = () => {
    try {
        const token = localStorage.getItem('authToken');
        const userString = localStorage.getItem('user');

        if (token && userString) {
            return {
                user: JSON.parse(userString),
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        }
    } catch (error) {
        console.error('Error loading auth from storage:', error);
    }
    return initialState;
};

const authSlice = createSlice({
    name: 'auth',
    initialState: loadAuthFromStorage(),
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;

            // Persist to localStorage
            localStorage.setItem('authToken', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;

            // Clear localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    clearError,
} = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
