/**
 * Milling Paddy Service
 * API client for Milling Paddy CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    MillingPaddyResponse,
    MillingPaddyListResponse,
    MillingPaddySummaryResponse,
    CreateMillingPaddyRequest,
    UpdateMillingPaddyRequest,
    MillingPaddyQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const MILLING_PADDY_ENDPOINT = (millId: string) =>
    `/mills/${millId}/milling-paddy`

// ==========================================
// Milling Paddy API Functions
// ==========================================

/**
 * Fetch all milling paddy entries with pagination and filters
 */
export const fetchMillingPaddyList = async (
    millId: string,
    params?: MillingPaddyQueryParams
): Promise<MillingPaddyListResponse> => {
    const response = await apiClient.get<ApiResponse<MillingPaddyListResponse>>(
        MILLING_PADDY_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single milling paddy entry by ID
 */
export const fetchMillingPaddyById = async (
    millId: string,
    id: string
): Promise<MillingPaddyResponse> => {
    const response = await apiClient.get<ApiResponse<MillingPaddyResponse>>(
        `${MILLING_PADDY_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch milling paddy summary/statistics
 */
export const fetchMillingPaddySummary = async (
    millId: string,
    params?: Pick<MillingPaddyQueryParams, 'startDate' | 'endDate'>
): Promise<MillingPaddySummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<MillingPaddySummaryResponse>
    >(`${MILLING_PADDY_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new milling paddy entry
 */
export const createMillingPaddy = async (
    millId: string,
    data: CreateMillingPaddyRequest
): Promise<MillingPaddyResponse> => {
    const response = await apiClient.post<ApiResponse<MillingPaddyResponse>>(
        MILLING_PADDY_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing milling paddy entry
 */
export const updateMillingPaddy = async (
    millId: string,
    { id, ...data }: UpdateMillingPaddyRequest
): Promise<MillingPaddyResponse> => {
    const response = await apiClient.put<ApiResponse<MillingPaddyResponse>>(
        `${MILLING_PADDY_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a milling paddy entry
 */
export const deleteMillingPaddy = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${MILLING_PADDY_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete milling paddy entries
 */
export const bulkDeleteMillingPaddy = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${MILLING_PADDY_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export milling paddy entries to CSV/Excel
 */
export const exportMillingPaddy = async (
    millId: string,
    params?: MillingPaddyQueryParams
): Promise<Blob> => {
    const response = await apiClient.get(
        `${MILLING_PADDY_ENDPOINT(millId)}/export`,
        {
            params,
            responseType: 'blob',
        }
    )
    return response.data
}
