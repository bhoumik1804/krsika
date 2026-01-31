/**
 * Daily Inward Service
 * API client for Daily Inward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    DailyInwardResponse,
    DailyInwardListResponse,
    DailyInwardSummaryResponse,
    CreateDailyInwardRequest,
    UpdateDailyInwardRequest,
    DailyInwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const DAILY_INWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/daily-inwards`

// ==========================================
// Daily Inward API Functions
// ==========================================

/**
 * Fetch all daily inward entries with pagination and filters
 */
export const fetchDailyInwardList = async (
    millId: string,
    params?: DailyInwardQueryParams
): Promise<DailyInwardListResponse> => {
    const response = await apiClient.get<ApiResponse<DailyInwardListResponse>>(
        DAILY_INWARD_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single daily inward entry by ID
 */
export const fetchDailyInwardById = async (
    millId: string,
    id: string
): Promise<DailyInwardResponse> => {
    const response = await apiClient.get<ApiResponse<DailyInwardResponse>>(
        `${DAILY_INWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch daily inward summary/statistics
 */
export const fetchDailyInwardSummary = async (
    millId: string,
    params?: Pick<DailyInwardQueryParams, 'startDate' | 'endDate'>
): Promise<DailyInwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<DailyInwardSummaryResponse>
    >(`${DAILY_INWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new daily inward entry
 */
export const createDailyInward = async (
    millId: string,
    data: CreateDailyInwardRequest
): Promise<DailyInwardResponse> => {
    const response = await apiClient.post<ApiResponse<DailyInwardResponse>>(
        DAILY_INWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing daily inward entry
 */
export const updateDailyInward = async (
    millId: string,
    { id, ...data }: UpdateDailyInwardRequest
): Promise<DailyInwardResponse> => {
    const response = await apiClient.put<ApiResponse<DailyInwardResponse>>(
        `${DAILY_INWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a daily inward entry
 */
export const deleteDailyInward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${DAILY_INWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete daily inward entries
 */
export const bulkDeleteDailyInward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${DAILY_INWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export daily inward entries to CSV/Excel
 */
export const exportDailyInward = async (
    millId: string,
    params?: DailyInwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${DAILY_INWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
