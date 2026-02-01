/**
 * Centralized API Client
 * Axios instance configuration for the entire application
 * Handles authentication, error handling, and request/response interceptors
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

// ==========================================
// Environment Configuration
// ==========================================

const API_BASE_URL = import.meta.env.VITE_API_URL

// ==========================================
// Axios Instance
// ==========================================

/**
 * Main API client instance
 * Used for all authenticated API requests
 */
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Include cookies in requests (for HTTP-only cookies)
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout
})

// ==========================================
// Error Handling Function
// ==========================================

/**
 * Common error handler for both authenticated and public API clients
 * Converts server errors to user-friendly messages
 */
const handleApiError = async (
    error: AxiosError,
    clientType: 'authenticated' | 'public' = 'authenticated'
) => {
    if (error.response) {
        // Server responded with error status
        const status = error.response.status
        const data = error.response.data as any

        // Log error in development
        if (import.meta.env.DEV) {
            const prefix =
                clientType === 'public' ? '[Public API Error]' : '[API Error]'
            console.error(
                `${prefix} ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
                status,
                data
            )
        }

        // Handle specific error codes
        switch (status) {
            case 401:
                throw new Error(
                    data?.message || 'Unauthorized. Please sign in again.'
                )
            case 403:
                throw new Error(
                    data?.message ||
                        'You do not have permission to perform this action.'
                )
            case 404:
                throw new Error(
                    data?.message || 'The requested resource was not found.'
                )
            case 422:
                throw new Error(
                    data?.message ||
                        'Validation failed. Please check your input.'
                )
            case 429:
                throw new Error(
                    data?.message ||
                        'Too many requests. Please try again later.'
                )
            case 500:
                throw new Error(
                    data?.message ||
                        'Internal server error. Please try again later.'
                )
            case 503:
                throw new Error(
                    data?.message ||
                        'Service is temporarily unavailable. Please try again later.'
                )
            default:
                throw new Error(data?.message || `An error occurred: ${status}`)
        }
    } else if (error.request) {
        // Request was made but no response received
        const prefix =
            clientType === 'public' ? '[Public API Error]' : '[API Error]'
        console.error(`${prefix} No response received:`, error.request)
        toast.warning('Network error. Please check your internet connection.')
        throw new Error('Network error. Please check your internet connection.')
    } else {
        // Something else happened while setting up the request
        const prefix =
            clientType === 'public' ? '[Public API Error]' : '[API Error]'
        console.error(`${prefix} Request setup error:`, error.message)
        throw new Error(error.message || 'An unexpected error occurred.')
    }
}

// ==========================================
// Request Interceptor
// ==========================================

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Cookies are automatically sent by browser due to withCredentials: true
        // No need to manually add Authorization header for HTTP-only cookies

        // Log request in development
        if (import.meta.env.DEV) {
            console.log(
                `[API Request] ${config.method?.toUpperCase()} ${config.url}`
            )
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// ==========================================
// Response Interceptor
// ==========================================

apiClient.interceptors.response.use(
    (response) => {
        // Log response in development
        if (import.meta.env.DEV) {
            console.log(
                `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
                response.status
            )
        }

        return response
    },
    async (error: AxiosError) => {
        const originalRequest = error.config
        const status = error.response?.status
        const url = originalRequest?.url ?? ''

        if (
            status === 401 &&
            originalRequest &&
            !(originalRequest as any)._retry &&
            !url.includes('/auth/refresh')
        ) {
            try {
                ;(originalRequest as any)._retry = true
                await apiClient.post('/auth/refresh')
                return apiClient(originalRequest)
            } catch (refreshError) {
                return handleApiError(
                    refreshError as AxiosError,
                    'authenticated'
                )
            }
        }

        return handleApiError(error, 'authenticated')
    }
)

// ==========================================
// Typed API Response
// ==========================================

/**
 * Standard API response format
 * Matches backend response structure
 */
export interface ApiResponse<T = any> {
    success: boolean
    statusCode: number
    data: T
    message: string
    pagination?: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasPrevPage: boolean
        hasNextPage: boolean
        prevPage: number | null
        nextPage: number | null
    }
}

// ==========================================
// Public API Client
// For unauthenticated requests (login, register, etc.)
// ==========================================

/**
 * Public API client instance
 * Used for unauthenticated requests like login, signup, etc.
 * Does NOT include cookies in requests
 */
export const publicApiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
})

// Request interceptor for public client
publicApiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Log request in development
        if (import.meta.env.DEV) {
            console.log(
                `[Public API Request] ${config.method?.toUpperCase()} ${config.url}`
            )
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for public client (same error handling as authenticated client)
publicApiClient.interceptors.response.use(
    (response) => {
        // Log response in development
        if (import.meta.env.DEV) {
            console.log(
                `[Public API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
                response.status
            )
        }

        return response
    },
    (error: AxiosError) => handleApiError(error, 'public')
)

// ==========================================
// Helper Functions
// ==========================================

// ==========================================
// Error Handling
// ==========================================

/**
 * For additional error handling with toast notifications,
 * use the handleServerError utility from @/lib/handle-server-error
 *
 * Example:
 * import { handleServerError } from '@/lib/handle-server-error'
 *
 * try {
 *     const response = await apiClient.get('/users')
 * } catch (error) {
 *     handleServerError(error)  // Shows toast notification
 * }
 */

// ==========================================
// Export default instance
// ==========================================

export default apiClient
