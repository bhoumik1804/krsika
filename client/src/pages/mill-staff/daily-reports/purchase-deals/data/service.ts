/**
 * Daily Purchase Deals Service
 * API client for Daily Purchase Deals CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    DailyPurchaseDealResponse,
    DailyPurchaseDealListResponse,
    DailyPurchaseDealSummaryResponse,
    CreateDailyPurchaseDealRequest,
    UpdateDailyPurchaseDealRequest,
    DailyPurchaseDealQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const DAILY_PURCHASE_DEAL_ENDPOINT = (millId: string) =>
    `/mills/${millId}/daily-purchase-deals`

// ==========================================
// Daily Purchase Deals API Functions
// ==========================================

/**
 * Fetch all daily purchase deal entries with pagination and filters
 */
export const fetchDailyPurchaseDealList = async (
    millId: string,
    params?: DailyPurchaseDealQueryParams
): Promise<DailyPurchaseDealListResponse> => {
    const response = await apiClient.get<
        ApiResponse<DailyPurchaseDealListResponse>
    >(DAILY_PURCHASE_DEAL_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single daily purchase deal entry by ID
 */
export const fetchDailyPurchaseDealById = async (
    millId: string,
    id: string
): Promise<DailyPurchaseDealResponse> => {
    const response = await apiClient.get<
        ApiResponse<DailyPurchaseDealResponse>
    >(`${DAILY_PURCHASE_DEAL_ENDPOINT(millId)}/${id}`)
    return response.data.data
}

/**
 * Fetch daily purchase deal summary/statistics
 */
export const fetchDailyPurchaseDealSummary = async (
    millId: string,
    params?: Pick<DailyPurchaseDealQueryParams, 'startDate' | 'endDate'>
): Promise<DailyPurchaseDealSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<DailyPurchaseDealSummaryResponse>
    >(`${DAILY_PURCHASE_DEAL_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new daily purchase deal entry
 */
export const createDailyPurchaseDeal = async (
    millId: string,
    data: CreateDailyPurchaseDealRequest
): Promise<DailyPurchaseDealResponse> => {
    const response = await apiClient.post<
        ApiResponse<DailyPurchaseDealResponse>
    >(DAILY_PURCHASE_DEAL_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing daily purchase deal entry
 */
export const updateDailyPurchaseDeal = async (
    millId: string,
    { id, ...data }: UpdateDailyPurchaseDealRequest
): Promise<DailyPurchaseDealResponse> => {
    const response = await apiClient.put<
        ApiResponse<DailyPurchaseDealResponse>
    >(`${DAILY_PURCHASE_DEAL_ENDPOINT(millId)}/${id}`, data)
    return response.data.data
}

/**
 * Delete a daily purchase deal entry
 */
export const deleteDailyPurchaseDeal = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${DAILY_PURCHASE_DEAL_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete daily purchase deal entries
 */
export const bulkDeleteDailyPurchaseDeal = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${DAILY_PURCHASE_DEAL_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export daily purchase deal entries to CSV/Excel
 */
export const exportDailyPurchaseDeal = async (
    millId: string,
    params?: DailyPurchaseDealQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${DAILY_PURCHASE_DEAL_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
