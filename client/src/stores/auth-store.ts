/**
 * Authentication Store (Zustand)
 * Manages UI state only, server state handled by react-query
 * - User data from successful auth
 * - Access tokens for API requests
 * - Logout functionality
 */
import { create } from 'zustand'
import type { AuthUser } from '@/lib/auth-service'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

interface UIAuthState {
    // User data
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void

    // Access token
    accessToken: string
    setAccessToken: (token: string) => void

    // Logout
    logout: () => void

    // Initialize from storage
    hydrate: () => void

    // Check if authenticated
    isAuthenticated: boolean
}

/**
 * useUIAuthStore
 * Zustand store for UI authentication state
 * Keep this minimal - only essential UI state
 */
export const useUIAuthStore = create<UIAuthState>()((set) => ({
    user: null,
    accessToken: '',
    isAuthenticated: false,

    setUser: (user) =>
        set(() => {
            if (user) {
                setCookie(USER_KEY, JSON.stringify(user))
            } else {
                removeCookie(USER_KEY)
            }
            return {
                user,
                isAuthenticated: !!user,
            }
        }),

    setAccessToken: (token) =>
        set(() => {
            if (token) {
                setCookie(ACCESS_TOKEN_KEY, token)
            } else {
                removeCookie(ACCESS_TOKEN_KEY)
            }
            return { accessToken: token }
        }),

    logout: () =>
        set(() => {
            removeCookie(ACCESS_TOKEN_KEY)
            removeCookie(USER_KEY)
            return {
                user: null,
                accessToken: '',
                isAuthenticated: false,
            }
        }),

    hydrate: () => {
        const storedUser = getCookie(USER_KEY)
        const storedToken = getCookie(ACCESS_TOKEN_KEY)

        const user = storedUser ? JSON.parse(storedUser) : null
        const token = storedToken || ''

        set({
            user,
            accessToken: token,
            isAuthenticated: !!user && !!token,
        })
    },
}))

/**
 * Initialize auth state from storage on app start
 */
export const initializeAuthState = () => {
    useUIAuthStore.getState().hydrate()
}

/**
 * Backward compatibility alias (for existing code)
 * Keep the old auth property structure for minimal migration
 */
export const useAuthStore = () => {
    const store = useUIAuthStore()
    return {
        auth: {
            user: store.user,
            setUser: store.setUser,
            accessToken: store.accessToken,
            setAccessToken: store.setAccessToken,
            reset: store.logout,
            resetAccessToken: () => store.setAccessToken(''),
        },
    }
}
