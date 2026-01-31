/**
 * Rice Inward Service
 * API client for Rice Inward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    RiceInwardResponse,
    RiceInwardListResponse,
    RiceInwardSummaryResponse,
    CreateRiceInwardRequest,
    UpdateRiceInwardRequest,
    RiceInwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const RICE_INWARD_ENDPOINT = (millId: string) => `/mills/${millId}/rice-inward`

// ==========================================
// Rice Inward API Functions
// ==========================================

/**
 * Fetch all rice inward entries with pagination and filters
 */
export const fetchRiceInwardList = async (
    millId: string,
    params?: RiceInwardQueryParams
): Promise<RiceInwardListResponse> => {
    const response = await apiClient.get<ApiResponse<RiceInwardListResponse>>(
        RICE_INWARD_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single rice inward entry by ID
 */
export const fetchRiceInwardById = async (
    millId: string,
    id: string
): Promise<RiceInwardResponse> => {
    const response = await apiClient.get<ApiResponse<RiceInwardResponse>>(
        `${RICE_INWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch rice inward summary/statistics
 */
export const fetchRiceInwardSummary = async (
    millId: string,
    params?: Pick<RiceInwardQueryParams, 'startDate' | 'endDate'>
): Promise<RiceInwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<RiceInwardSummaryResponse>
    >(`${RICE_INWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new rice inward entry
 */
export const createRiceInward = async (
    millId: string,
    data: CreateRiceInwardRequest
): Promise<RiceInwardResponse> => {
    const response = await apiClient.post<ApiResponse<RiceInwardResponse>>(
        RICE_INWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing rice inward entry
 */
export const updateRiceInward = async (
    millId: string,
    { id, ...data }: UpdateRiceInwardRequest
): Promise<RiceInwardResponse> => {
    const response = await apiClient.put<ApiResponse<RiceInwardResponse>>(
        `${RICE_INWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a rice inward entry
 */
export const deleteRiceInward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${RICE_INWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete rice inward entries
 */
export const bulkDeleteRiceInward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${RICE_INWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export rice inward entries to CSV/Excel
 */
export const exportRiceInward = async (
    millId: string,
    params?: RiceInwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${RICE_INWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
