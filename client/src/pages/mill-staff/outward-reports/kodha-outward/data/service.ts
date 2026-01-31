/**
 * Kodha Outward Service
 * API client for Kodha Outward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    KodhaOutwardResponse,
    KodhaOutwardListResponse,
    KodhaOutwardSummaryResponse,
    CreateKodhaOutwardRequest,
    UpdateKodhaOutwardRequest,
    KodhaOutwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const KODHA_OUTWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/kodha-outward`

// ==========================================
// Kodha Outward API Functions
// ==========================================

/**
 * Fetch all kodha outward entries with pagination and filters
 */
export const fetchKodhaOutwardList = async (
    millId: string,
    params?: KodhaOutwardQueryParams
): Promise<KodhaOutwardListResponse> => {
    const response = await apiClient.get<ApiResponse<KodhaOutwardListResponse>>(
        KODHA_OUTWARD_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single kodha outward entry by ID
 */
export const fetchKodhaOutwardById = async (
    millId: string,
    id: string
): Promise<KodhaOutwardResponse> => {
    const response = await apiClient.get<ApiResponse<KodhaOutwardResponse>>(
        `${KODHA_OUTWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch kodha outward summary/statistics
 */
export const fetchKodhaOutwardSummary = async (
    millId: string,
    params?: Pick<KodhaOutwardQueryParams, 'startDate' | 'endDate'>
): Promise<KodhaOutwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<KodhaOutwardSummaryResponse>
    >(`${KODHA_OUTWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new kodha outward entry
 */
export const createKodhaOutward = async (
    millId: string,
    data: CreateKodhaOutwardRequest
): Promise<KodhaOutwardResponse> => {
    const response = await apiClient.post<ApiResponse<KodhaOutwardResponse>>(
        KODHA_OUTWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing kodha outward entry
 */
export const updateKodhaOutward = async (
    millId: string,
    { id, ...data }: UpdateKodhaOutwardRequest
): Promise<KodhaOutwardResponse> => {
    const response = await apiClient.put<ApiResponse<KodhaOutwardResponse>>(
        `${KODHA_OUTWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a kodha outward entry
 */
export const deleteKodhaOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${KODHA_OUTWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete kodha outward entries
 */
export const bulkDeleteKodhaOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${KODHA_OUTWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export kodha outward entries to CSV/Excel
 */
export const exportKodhaOutward = async (
    millId: string,
    params?: KodhaOutwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${KODHA_OUTWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
