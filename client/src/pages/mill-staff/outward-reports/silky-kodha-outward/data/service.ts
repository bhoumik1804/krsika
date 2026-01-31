/**
 * Silky Kodha Outward Service
 * API client for Silky Kodha Outward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    SilkyKodhaOutwardResponse,
    SilkyKodhaOutwardListResponse,
    SilkyKodhaOutwardSummaryResponse,
    CreateSilkyKodhaOutwardRequest,
    UpdateSilkyKodhaOutwardRequest,
    SilkyKodhaOutwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const SILKY_KODHA_OUTWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/silky-kodha-outward`

// ==========================================
// Silky Kodha Outward API Functions
// ==========================================

/**
 * Fetch all silky kodha outward entries with pagination and filters
 */
export const fetchSilkyKodhaOutwardList = async (
    millId: string,
    params?: SilkyKodhaOutwardQueryParams
): Promise<SilkyKodhaOutwardListResponse> => {
    const response = await apiClient.get<
        ApiResponse<SilkyKodhaOutwardListResponse>
    >(SILKY_KODHA_OUTWARD_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single silky kodha outward entry by ID
 */
export const fetchSilkyKodhaOutwardById = async (
    millId: string,
    id: string
): Promise<SilkyKodhaOutwardResponse> => {
    const response = await apiClient.get<
        ApiResponse<SilkyKodhaOutwardResponse>
    >(`${SILKY_KODHA_OUTWARD_ENDPOINT(millId)}/${id}`)
    return response.data.data
}

/**
 * Fetch silky kodha outward summary/statistics
 */
export const fetchSilkyKodhaOutwardSummary = async (
    millId: string,
    params?: Pick<SilkyKodhaOutwardQueryParams, 'startDate' | 'endDate'>
): Promise<SilkyKodhaOutwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<SilkyKodhaOutwardSummaryResponse>
    >(`${SILKY_KODHA_OUTWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new silky kodha outward entry
 */
export const createSilkyKodhaOutward = async (
    millId: string,
    data: CreateSilkyKodhaOutwardRequest
): Promise<SilkyKodhaOutwardResponse> => {
    const response = await apiClient.post<
        ApiResponse<SilkyKodhaOutwardResponse>
    >(SILKY_KODHA_OUTWARD_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing silky kodha outward entry
 */
export const updateSilkyKodhaOutward = async (
    millId: string,
    { id, ...data }: UpdateSilkyKodhaOutwardRequest
): Promise<SilkyKodhaOutwardResponse> => {
    const response = await apiClient.put<
        ApiResponse<SilkyKodhaOutwardResponse>
    >(`${SILKY_KODHA_OUTWARD_ENDPOINT(millId)}/${id}`, data)
    return response.data.data
}

/**
 * Delete a silky kodha outward entry
 */
export const deleteSilkyKodhaOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${SILKY_KODHA_OUTWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete silky kodha outward entries
 */
export const bulkDeleteSilkyKodhaOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${SILKY_KODHA_OUTWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export silky kodha outward entries to CSV/Excel
 */
export const exportSilkyKodhaOutward = async (
    millId: string,
    params?: SilkyKodhaOutwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${SILKY_KODHA_OUTWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
