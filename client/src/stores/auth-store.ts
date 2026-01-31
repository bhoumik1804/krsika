/**
 * Authentication Store (Zustand)
 * Manages UI state only, server state handled by react-query
 * - User data from successful auth
 * - Access tokens for API requests
 * - Logout functionality
 */
import type { User } from '@/types'
import { create } from 'zustand'

interface AuthState {
    // User data
    user: User | null
    isAuthenticated: boolean

    // Methods
    setUser: (user: User | null) => void
    logout: () => void
}

/**
 * useUIAuthStore
 * Zustand store for UI authentication state
 * Keep this minimal - only essential UI state
 */
export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) =>
        set({
            user,
            isAuthenticated: true,
        }),

    logout: () =>
        set({
            user: null,
            isAuthenticated: false,
        }),
}))
