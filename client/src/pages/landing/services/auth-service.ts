/**
 * Landing Page Auth Service
 * API client for authentication operations
 * Uses centralized axios instance with cookie-based auth
 */
import type { User } from '@/types'
import apiClient, { publicApiClient, type ApiResponse } from '@/lib/api-client'

const API_BASE_URL = import.meta.env.VITE_API_URL

// ==========================================
// Auth API Functions
// ==========================================

/**
 * Initiate Google OAuth flow
 * Redirects user to backend Google auth endpoint
 */
export const initiateGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`
}

/**
 * Fetch current authenticated user
 * Used by React Query to get user data
 */
export const fetchUser = async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me')
    return response.data.data
}

/**
 * Login with email and password
 * Uses public API client for unauthenticated request
 */
export const loginWithCredentials = async (credentials: {
    email: string
    password: string
}): Promise<User> => {
    const response = await publicApiClient.post<ApiResponse<{ user: User }>>(
        '/auth/login',
        credentials
    )
    return response.data.data.user
}

/**
 * Signup with email and password
 * Uses public API client for unauthenticated request
 */
export const signupWithCredentials = async (data: {
    fullName: string
    email: string
    password: string
}): Promise<User> => {
    const response = await publicApiClient.post<ApiResponse<{ user: User }>>(
        '/auth/signup',
        data
    )
    return response.data.data.user
}

/**
 * Logout user
 * Clears cookies on server
 */
export const logout = async (): Promise<void> => {
    await apiClient.post('/auth/logout')
}

/**
 * Refresh access token
 * Uses refresh token cookie to get new access token
 */
export const refreshToken = async (): Promise<User> => {
    const response =
        await apiClient.post<ApiResponse<{ user: User }>>('/auth/refresh')
    return response.data.data.user
}

/**
 * Update user profile
 */
export const updateProfile = async (data: {
    name?: string
    avatar?: string
}): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(
        '/auth/profile',
        data
    )
    return response.data.data
}

/**
 * Change password
 */
export const changePassword = async (data: {
    currentPassword: string
    newPassword: string
}): Promise<void> => {
    await apiClient.put('/auth/password', data)
}
