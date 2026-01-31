/**
 * Landing Page Auth Hooks
 * React Query hooks for authentication state management
 * Integrates with Zustand for UI state synchronization
 */
import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { User } from '@/types'
import { useAuthStore } from '@/stores/auth-store'
import {
    fetchUser,
    loginWithCredentials,
    signupWithCredentials,
    logout,
    initiateGoogleLogin,
    refreshToken,
    updateProfile,
    changePassword,
} from '../services/auth-service'

// ==========================================
// Query Keys
// ==========================================

export const authKeys = {
    all: ['auth'] as const,
    user: () => [...authKeys.all, 'user'] as const,
    profile: () => [...authKeys.all, 'profile'] as const,
}

// ==========================================
// useUser Hook
// Fetches and manages user data with React Query
// ==========================================

interface UseUserOptions {
    enabled?: boolean
    refetchOnWindowFocus?: boolean
    retry?: boolean | number
}

export const useUser = (options: UseUserOptions = {}) => {
    const { setUser } = useAuthStore()

    const {
        enabled = true,
        refetchOnWindowFocus = true,
        retry = false,
    } = options

    const query = useQuery({
        queryKey: authKeys.user(),
        queryFn: fetchUser,
        enabled,
        refetchOnWindowFocus,
        retry,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    })

    // Sync with Zustand when user data changes
    useEffect(() => {
        if (query.data) {
            setUser(query.data)
        } else if (query.isError) {
            setUser(null)
        }
    }, [query.data, query.isError, setUser])

    return {
        user: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        isAuthenticated: !!query.data && !query.isError,
        refetch: query.refetch,
    }
}

// ==========================================
// useGoogleLogin Hook
// Initiates Google OAuth flow
// ==========================================

export const useGoogleLogin = () => {
    return {
        login: initiateGoogleLogin,
        isLoading: false, // Google OAuth redirects, so no loading state
    }
}

// ==========================================
// useCredentialsLogin Hook
// Login with email and password
// ==========================================

export const useCredentialsLogin = () => {
    const queryClient = useQueryClient()
    const { setUser } = useAuthStore()

    const mutation = useMutation({
        mutationFn: loginWithCredentials,
        onSuccess: (user: User) => {
            // Update React Query cache
            queryClient.setQueryData(authKeys.user(), user)

            // Update Zustand
            setUser(user)
        },
    })

    return {
        login: mutation.mutate,
        loginAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    }
}

// ==========================================
// useSignup Hook
// Signup with email and password
// ==========================================

export const useSignup = () => {
    const queryClient = useQueryClient()
    const { setUser } = useAuthStore()

    const mutation = useMutation({
        mutationFn: signupWithCredentials,
        onSuccess: (user: User) => {
            // Update React Query cache
            queryClient.setQueryData(authKeys.user(), user)

            // Update Zustand
            setUser(user)
        },
    })

    return {
        signup: mutation.mutate,
        signupAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    }
}

// ==========================================
// useLogout Hook
// Logout user and clear all state
// ==========================================

export const useLogout = () => {
    const queryClient = useQueryClient()
    const { logout: zustandLogout } = useAuthStore()

    const mutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            // Clear all React Query cache
            queryClient.clear()

            // Clear Zustand store
            zustandLogout()
        },
        onError: () => {
            // Even on error, clear local state
            queryClient.clear()
            zustandLogout()
        },
    })

    return {
        logout: mutation.mutate,
        logoutAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
    }
}

// ==========================================
// useRefreshToken Hook
// Manually refresh access token
// ==========================================

export const useRefreshToken = () => {
    const queryClient = useQueryClient()
    const { setUser } = useAuthStore()

    const mutation = useMutation({
        mutationFn: refreshToken,
        onSuccess: (user: User) => {
            queryClient.setQueryData(authKeys.user(), user)
            setUser(user)
        },
    })

    return {
        refresh: mutation.mutate,
        refreshAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}

// ==========================================
// useUpdateProfile Hook
// Update user profile
// ==========================================

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    const { setUser } = useAuthStore()

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (user: User) => {
            // Update cache
            queryClient.setQueryData(authKeys.user(), user)

            // Update Zustand
            setUser(user)

            // Invalidate to refetch fresh data
            queryClient.invalidateQueries({ queryKey: authKeys.user() })
        },
    })

    return {
        updateProfile: mutation.mutate,
        updateProfileAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    }
}

// ==========================================
// useChangePassword Hook
// Change user password
// ==========================================

export const useChangePassword = () => {
    const queryClient = useQueryClient()
    const { logout: zustandLogout } = useAuthStore()

    const mutation = useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            // Password changed, user needs to login again
            // Clear all state
            queryClient.clear()
            zustandLogout()
        },
    })

    return {
        changePassword: mutation.mutate,
        changePasswordAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    }
}

// ==========================================
// useAuthSync Hook
// Automatically sync auth state on app load
// Call this in your root component
// ==========================================

export const useAuthSync = () => {
    const { isLoading, isAuthenticated, user } = useUser({
        refetchOnWindowFocus: true,
        retry: false,
    })

    return {
        isLoading,
        isAuthenticated,
        user,
        isAppReady: !isLoading, // App is ready when user check is complete
    }
}
