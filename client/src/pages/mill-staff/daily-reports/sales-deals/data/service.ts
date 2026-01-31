/**
 * Daily Sales Deals Service
 * API client for Daily Sales Deals CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    DailySalesDealResponse,
    DailySalesDealListResponse,
    DailySalesDealSummaryResponse,
    CreateDailySalesDealRequest,
    UpdateDailySalesDealRequest,
    DailySalesDealQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const DAILY_SALES_DEAL_ENDPOINT = (millId: string) =>
    `/mills/${millId}/daily-sales-deals`

// ==========================================
// Daily Sales Deals API Functions
// ==========================================

/**
 * Fetch all daily sales deal entries with pagination and filters
 */
export const fetchDailySalesDealList = async (
    millId: string,
    params?: DailySalesDealQueryParams
): Promise<DailySalesDealListResponse> => {
    const response = await apiClient.get<
        ApiResponse<DailySalesDealListResponse>
    >(DAILY_SALES_DEAL_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single daily sales deal entry by ID
 */
export const fetchDailySalesDealById = async (
    millId: string,
    id: string
): Promise<DailySalesDealResponse> => {
    const response = await apiClient.get<ApiResponse<DailySalesDealResponse>>(
        `${DAILY_SALES_DEAL_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch daily sales deal summary/statistics
 */
export const fetchDailySalesDealSummary = async (
    millId: string,
    params?: Pick<DailySalesDealQueryParams, 'startDate' | 'endDate'>
): Promise<DailySalesDealSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<DailySalesDealSummaryResponse>
    >(`${DAILY_SALES_DEAL_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new daily sales deal entry
 */
export const createDailySalesDeal = async (
    millId: string,
    data: CreateDailySalesDealRequest
): Promise<DailySalesDealResponse> => {
    const response = await apiClient.post<ApiResponse<DailySalesDealResponse>>(
        DAILY_SALES_DEAL_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing daily sales deal entry
 */
export const updateDailySalesDeal = async (
    millId: string,
    { id, ...data }: UpdateDailySalesDealRequest
): Promise<DailySalesDealResponse> => {
    const response = await apiClient.put<ApiResponse<DailySalesDealResponse>>(
        `${DAILY_SALES_DEAL_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a daily sales deal entry
 */
export const deleteDailySalesDeal = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${DAILY_SALES_DEAL_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete daily sales deal entries
 */
export const bulkDeleteDailySalesDeal = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${DAILY_SALES_DEAL_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export daily sales deal entries to CSV/Excel
 */
export const exportDailySalesDeal = async (
    millId: string,
    params?: DailySalesDealQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${DAILY_SALES_DEAL_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
