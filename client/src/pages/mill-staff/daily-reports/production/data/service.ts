/**
 * Daily Production Service
 * API client for Daily Production CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    DailyProductionResponse,
    DailyProductionListResponse,
    DailyProductionSummaryResponse,
    CreateDailyProductionRequest,
    UpdateDailyProductionRequest,
    DailyProductionQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const DAILY_PRODUCTION_ENDPOINT = (millId: string) =>
    `/mills/${millId}/daily-production`

// ==========================================
// Daily Production API Functions
// ==========================================

/**
 * Fetch all daily production entries with pagination and filters
 */
export const fetchDailyProductionList = async (
    millId: string,
    params?: DailyProductionQueryParams
): Promise<DailyProductionListResponse> => {
    const response = await apiClient.get<
        ApiResponse<DailyProductionListResponse>
    >(DAILY_PRODUCTION_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single daily production entry by ID
 */
export const fetchDailyProductionById = async (
    millId: string,
    id: string
): Promise<DailyProductionResponse> => {
    const response = await apiClient.get<ApiResponse<DailyProductionResponse>>(
        `${DAILY_PRODUCTION_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch daily production summary/statistics
 */
export const fetchDailyProductionSummary = async (
    millId: string,
    params?: Pick<DailyProductionQueryParams, 'startDate' | 'endDate'>
): Promise<DailyProductionSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<DailyProductionSummaryResponse>
    >(`${DAILY_PRODUCTION_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new daily production entry
 */
export const createDailyProduction = async (
    millId: string,
    data: CreateDailyProductionRequest
): Promise<DailyProductionResponse> => {
    const response = await apiClient.post<ApiResponse<DailyProductionResponse>>(
        DAILY_PRODUCTION_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing daily production entry
 */
export const updateDailyProduction = async (
    millId: string,
    { id, ...data }: UpdateDailyProductionRequest
): Promise<DailyProductionResponse> => {
    const response = await apiClient.put<ApiResponse<DailyProductionResponse>>(
        `${DAILY_PRODUCTION_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a daily production entry
 */
export const deleteDailyProduction = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${DAILY_PRODUCTION_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete daily production entries
 */
export const bulkDeleteDailyProduction = async (
    millId: string,
    ids: string[]
): Promise<{ deletedCount: number; requestedCount: number }> => {
    const response = await apiClient.delete<
        ApiResponse<{ deletedCount: number; requestedCount: number }>
    >(`${DAILY_PRODUCTION_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
    return response.data.data
}

/**
 * Export daily production entries to CSV/Excel
 */
export const exportDailyProduction = async (
    millId: string,
    params?: DailyProductionQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${DAILY_PRODUCTION_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
