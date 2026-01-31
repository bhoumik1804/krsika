/**
 * Daily Receipt Service
 * API client for Daily Receipt CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    DailyReceiptResponse,
    DailyReceiptListResponse,
    DailyReceiptSummaryResponse,
    CreateDailyReceiptRequest,
    UpdateDailyReceiptRequest,
    DailyReceiptQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const DAILY_RECEIPT_ENDPOINT = (millId: string) =>
    `/mills/${millId}/daily-receipts`

// ==========================================
// Daily Receipt API Functions
// ==========================================

/**
 * Fetch all daily receipt entries with pagination and filters
 */
export const fetchDailyReceiptList = async (
    millId: string,
    params?: DailyReceiptQueryParams
): Promise<DailyReceiptListResponse> => {
    const response = await apiClient.get<ApiResponse<DailyReceiptListResponse>>(
        DAILY_RECEIPT_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single daily receipt entry by ID
 */
export const fetchDailyReceiptById = async (
    millId: string,
    id: string
): Promise<DailyReceiptResponse> => {
    const response = await apiClient.get<ApiResponse<DailyReceiptResponse>>(
        `${DAILY_RECEIPT_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch daily receipt summary/statistics
 */
export const fetchDailyReceiptSummary = async (
    millId: string,
    params?: Pick<DailyReceiptQueryParams, 'startDate' | 'endDate'>
): Promise<DailyReceiptSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<DailyReceiptSummaryResponse>
    >(`${DAILY_RECEIPT_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new daily receipt entry
 */
export const createDailyReceipt = async (
    millId: string,
    data: CreateDailyReceiptRequest
): Promise<DailyReceiptResponse> => {
    const response = await apiClient.post<ApiResponse<DailyReceiptResponse>>(
        DAILY_RECEIPT_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing daily receipt entry
 */
export const updateDailyReceipt = async (
    millId: string,
    { id, ...data }: UpdateDailyReceiptRequest
): Promise<DailyReceiptResponse> => {
    const response = await apiClient.put<ApiResponse<DailyReceiptResponse>>(
        `${DAILY_RECEIPT_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a daily receipt entry
 */
export const deleteDailyReceipt = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${DAILY_RECEIPT_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete daily receipt entries
 */
export const bulkDeleteDailyReceipt = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${DAILY_RECEIPT_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export daily receipt entries to CSV/Excel
 */
export const exportDailyReceipt = async (
    millId: string,
    params?: DailyReceiptQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${DAILY_RECEIPT_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
