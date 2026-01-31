/**
 * Daily Outward Service
 * API client for Daily Outward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    DailyOutwardResponse,
    DailyOutwardListResponse,
    DailyOutwardSummaryResponse,
    CreateDailyOutwardRequest,
    UpdateDailyOutwardRequest,
    DailyOutwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const DAILY_OUTWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/daily-outwards`

// ==========================================
// Daily Outward API Functions
// ==========================================

/**
 * Fetch all daily outward entries with pagination and filters
 */
export const fetchDailyOutwardList = async (
    millId: string,
    params?: DailyOutwardQueryParams
): Promise<DailyOutwardListResponse> => {
    const response = await apiClient.get<ApiResponse<DailyOutwardListResponse>>(
        DAILY_OUTWARD_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single daily outward entry by ID
 */
export const fetchDailyOutwardById = async (
    millId: string,
    id: string
): Promise<DailyOutwardResponse> => {
    const response = await apiClient.get<ApiResponse<DailyOutwardResponse>>(
        `${DAILY_OUTWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch daily outward summary/statistics
 */
export const fetchDailyOutwardSummary = async (
    millId: string,
    params?: Pick<DailyOutwardQueryParams, 'startDate' | 'endDate'>
): Promise<DailyOutwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<DailyOutwardSummaryResponse>
    >(`${DAILY_OUTWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new daily outward entry
 */
export const createDailyOutward = async (
    millId: string,
    data: CreateDailyOutwardRequest
): Promise<DailyOutwardResponse> => {
    const response = await apiClient.post<ApiResponse<DailyOutwardResponse>>(
        DAILY_OUTWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing daily outward entry
 */
export const updateDailyOutward = async (
    millId: string,
    { id, ...data }: UpdateDailyOutwardRequest
): Promise<DailyOutwardResponse> => {
    const response = await apiClient.put<ApiResponse<DailyOutwardResponse>>(
        `${DAILY_OUTWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a daily outward entry
 */
export const deleteDailyOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${DAILY_OUTWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete daily outward entries
 */
export const bulkDeleteDailyOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${DAILY_OUTWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export daily outward entries to CSV/Excel
 */
export const exportDailyOutward = async (
    millId: string,
    params?: DailyOutwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${DAILY_OUTWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
