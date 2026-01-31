/**
 * Daily Milling Service
 * API client for Daily Milling CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    DailyMillingResponse,
    DailyMillingListResponse,
    DailyMillingSummaryResponse,
    CreateDailyMillingRequest,
    UpdateDailyMillingRequest,
    DailyMillingQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const DAILY_MILLING_ENDPOINT = (millId: string) =>
    `/mills/${millId}/daily-milling`

// ==========================================
// Daily Milling API Functions
// ==========================================

/**
 * Fetch all daily milling entries with pagination and filters
 */
export const fetchDailyMillingList = async (
    millId: string,
    params?: DailyMillingQueryParams
): Promise<DailyMillingListResponse> => {
    const response = await apiClient.get<ApiResponse<DailyMillingListResponse>>(
        DAILY_MILLING_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single daily milling entry by ID
 */
export const fetchDailyMillingById = async (
    millId: string,
    id: string
): Promise<DailyMillingResponse> => {
    const response = await apiClient.get<ApiResponse<DailyMillingResponse>>(
        `${DAILY_MILLING_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch daily milling summary/statistics
 */
export const fetchDailyMillingSummary = async (
    millId: string,
    params?: Pick<DailyMillingQueryParams, 'startDate' | 'endDate'>
): Promise<DailyMillingSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<DailyMillingSummaryResponse>
    >(`${DAILY_MILLING_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new daily milling entry
 */
export const createDailyMilling = async (
    millId: string,
    data: CreateDailyMillingRequest
): Promise<DailyMillingResponse> => {
    const response = await apiClient.post<ApiResponse<DailyMillingResponse>>(
        DAILY_MILLING_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing daily milling entry
 */
export const updateDailyMilling = async (
    millId: string,
    { id, ...data }: UpdateDailyMillingRequest
): Promise<DailyMillingResponse> => {
    const response = await apiClient.put<ApiResponse<DailyMillingResponse>>(
        `${DAILY_MILLING_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a daily milling entry
 */
export const deleteDailyMilling = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${DAILY_MILLING_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete daily milling entries
 */
export const bulkDeleteDailyMilling = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${DAILY_MILLING_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export daily milling entries to CSV/Excel
 */
export const exportDailyMilling = async (
    millId: string,
    params?: DailyMillingQueryParams
): Promise<Blob> => {
    const response = await apiClient.get(
        `${DAILY_MILLING_ENDPOINT(millId)}/export`,
        {
            params,
            responseType: 'blob',
        }
    )
    return response.data
}
