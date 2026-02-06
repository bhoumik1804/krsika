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
 * * CHANGE: This now returns Promise.reject(error) instead of throwing a new Error.
 * This allows components to access err.response.data.message.
 */
const handleApiError = async (
    error: AxiosError,
    clientType: 'authenticated' | 'public' = 'authenticated'
) => {
    const prefix =
        clientType === 'public' ? '[Public API Error]' : '[API Error]'

    // 1. Log the error in development
    if (import.meta.env.DEV) {
        if (error.response) {
            console.error(
                `${prefix} ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
                error.response.status,
                error.response.data
            )
        } else if (error.request) {
            console.error(`${prefix} No response received:`, error.request)
        } else {
            console.error(`${prefix} Request setup error:`, error.message)
        }
    }

    // 2. Handle Network Errors (No Response)
    if (!error.response) {
        toast.warning('Network error. Please check your internet connection.')
        // We reject with the original error so the component handles it if needed
        return Promise.reject(error)
    }

    // 3. Normalize Error Messages in response.data
    // This ensures err.response.data.message ALWAYS exists, even if server sent empty body
    const status = error.response.status
    const data = error.response.data as any

    // If data is missing or not an object, initialize it
    if (!data || typeof data !== 'object') {
        error.response.data = { message: '' }
    }

    // If message is missing, inject a default based on status code
    if (!(error.response.data as any).message) {
        let defaultMsg = 'An unexpected error occurred.'
        switch (status) {
            case 401:
                defaultMsg = 'Unauthorized. Please sign in again.'
                break
            case 403:
                defaultMsg =
                    'You do not have permission to perform this action.'
                break
            case 404:
                defaultMsg = 'The requested resource was not found.'
                break
            case 422:
                defaultMsg = 'Validation failed. Please check your input.'
                break
            case 429:
                defaultMsg = 'Too many requests. Please try again later.'
                break
            case 500:
                defaultMsg = 'Internal server error. Please try again later.'
                break
            case 503:
                defaultMsg = 'Service is temporarily unavailable.'
                break
            default:
                defaultMsg = `An error occurred: ${status}`
        }
        ;(error.response.data as any).message = defaultMsg
    }

    // 4. Return the rejected promise containing the FULL error object
    return Promise.reject(error)
}

// ==========================================
// Request Interceptor
// ==========================================

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
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

        // Handle 401 Refresh Token logic
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
// ==========================================

export const publicApiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
})

publicApiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
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

publicApiClient.interceptors.response.use(
    (response) => {
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
// Export default instance
// ==========================================

export default apiClient

/**
 * USAGE EXAMPLE:
 * * try {
 * await apiClient.post('/users');
 * } catch (err: any) {
 * // Now this works safely:
 * const msg = err?.response?.data?.message;
 * toast.error(msg);
 * }
 */
