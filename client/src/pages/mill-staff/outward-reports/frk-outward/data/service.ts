/**
 * FRK Outward Service
 * API client for FRK Outward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    FrkOutwardResponse,
    FrkOutwardListResponse,
    FrkOutwardSummaryResponse,
    CreateFrkOutwardRequest,
    UpdateFrkOutwardRequest,
    FrkOutwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const FRK_OUTWARD_ENDPOINT = (millId: string) => `/mills/${millId}/frk-outward`

// ==========================================
// FRK Outward API Functions
// ==========================================

/**
 * Fetch all FRK outward entries with pagination and filters
 */
export const fetchFrkOutwardList = async (
    millId: string,
    params?: FrkOutwardQueryParams
): Promise<FrkOutwardListResponse> => {
    const response = await apiClient.get<ApiResponse<FrkOutwardListResponse>>(
        FRK_OUTWARD_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single FRK outward entry by ID
 */
export const fetchFrkOutwardById = async (
    millId: string,
    id: string
): Promise<FrkOutwardResponse> => {
    const response = await apiClient.get<ApiResponse<FrkOutwardResponse>>(
        `${FRK_OUTWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch FRK outward summary/statistics
 */
export const fetchFrkOutwardSummary = async (
    millId: string,
    params?: Pick<FrkOutwardQueryParams, 'startDate' | 'endDate'>
): Promise<FrkOutwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<FrkOutwardSummaryResponse>
    >(`${FRK_OUTWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new FRK outward entry
 */
export const createFrkOutward = async (
    millId: string,
    data: CreateFrkOutwardRequest
): Promise<FrkOutwardResponse> => {
    const response = await apiClient.post<ApiResponse<FrkOutwardResponse>>(
        FRK_OUTWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing FRK outward entry
 */
export const updateFrkOutward = async (
    millId: string,
    { id, ...data }: UpdateFrkOutwardRequest
): Promise<FrkOutwardResponse> => {
    const response = await apiClient.put<ApiResponse<FrkOutwardResponse>>(
        `${FRK_OUTWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a FRK outward entry
 */
export const deleteFrkOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${FRK_OUTWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete FRK outward entries
 */
export const bulkDeleteFrkOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${FRK_OUTWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export FRK outward entries to CSV/Excel
 */
export const exportFrkOutward = async (
    millId: string,
    params?: FrkOutwardQueryParams
): Promise<Blob> => {
    const response = await apiClient.get(
        `${FRK_OUTWARD_ENDPOINT(millId)}/export`,
        {
            params,
            responseType: 'blob',
        }
    )
    return response.data
}
