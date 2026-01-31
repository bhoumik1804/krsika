/**
 * Daily Payment Service
 * API client for Daily Payment CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    DailyPaymentResponse,
    DailyPaymentListResponse,
    DailyPaymentSummaryResponse,
    CreateDailyPaymentRequest,
    UpdateDailyPaymentRequest,
    DailyPaymentQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const DAILY_PAYMENT_ENDPOINT = (millId: string) =>
    `/mills/${millId}/daily-payments`

// ==========================================
// Daily Payment API Functions
// ==========================================

/**
 * Fetch all daily payment entries with pagination and filters
 */
export const fetchDailyPaymentList = async (
    millId: string,
    params?: DailyPaymentQueryParams
): Promise<DailyPaymentListResponse> => {
    const response = await apiClient.get<ApiResponse<DailyPaymentListResponse>>(
        DAILY_PAYMENT_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single daily payment entry by ID
 */
export const fetchDailyPaymentById = async (
    millId: string,
    id: string
): Promise<DailyPaymentResponse> => {
    const response = await apiClient.get<ApiResponse<DailyPaymentResponse>>(
        `${DAILY_PAYMENT_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch daily payment summary/statistics
 */
export const fetchDailyPaymentSummary = async (
    millId: string,
    params?: Pick<DailyPaymentQueryParams, 'startDate' | 'endDate'>
): Promise<DailyPaymentSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<DailyPaymentSummaryResponse>
    >(`${DAILY_PAYMENT_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new daily payment entry
 */
export const createDailyPayment = async (
    millId: string,
    data: CreateDailyPaymentRequest
): Promise<DailyPaymentResponse> => {
    const response = await apiClient.post<ApiResponse<DailyPaymentResponse>>(
        DAILY_PAYMENT_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing daily payment entry
 */
export const updateDailyPayment = async (
    millId: string,
    { id, ...data }: UpdateDailyPaymentRequest
): Promise<DailyPaymentResponse> => {
    const response = await apiClient.put<ApiResponse<DailyPaymentResponse>>(
        `${DAILY_PAYMENT_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a daily payment entry
 */
export const deleteDailyPayment = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${DAILY_PAYMENT_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete daily payment entries
 */
export const bulkDeleteDailyPayment = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${DAILY_PAYMENT_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export daily payment entries to CSV/Excel
 */
export const exportDailyPayment = async (
    millId: string,
    params?: DailyPaymentQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${DAILY_PAYMENT_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
