/**
 * Govt Paddy Inward Service
 * API client for Govt Paddy Inward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    GovtPaddyInwardResponse,
    GovtPaddyInwardListResponse,
    GovtPaddyInwardSummaryResponse,
    CreateGovtPaddyInwardRequest,
    UpdateGovtPaddyInwardRequest,
    GovtPaddyInwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const GOVT_PADDY_INWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/govt-paddy-inward`

// ==========================================
// Govt Paddy Inward API Functions
// ==========================================

/**
 * Fetch all govt paddy inward entries with pagination and filters
 */
export const fetchGovtPaddyInwardList = async (
    millId: string,
    params?: GovtPaddyInwardQueryParams
): Promise<GovtPaddyInwardListResponse> => {
    const response = await apiClient.get<
        ApiResponse<GovtPaddyInwardListResponse>
    >(GOVT_PADDY_INWARD_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single govt paddy inward entry by ID
 */
export const fetchGovtPaddyInwardById = async (
    millId: string,
    id: string
): Promise<GovtPaddyInwardResponse> => {
    const response = await apiClient.get<ApiResponse<GovtPaddyInwardResponse>>(
        `${GOVT_PADDY_INWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch govt paddy inward summary/statistics
 */
export const fetchGovtPaddyInwardSummary = async (
    millId: string,
    params?: Pick<GovtPaddyInwardQueryParams, 'startDate' | 'endDate'>
): Promise<GovtPaddyInwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<GovtPaddyInwardSummaryResponse>
    >(`${GOVT_PADDY_INWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new govt paddy inward entry
 */
export const createGovtPaddyInward = async (
    millId: string,
    data: CreateGovtPaddyInwardRequest
): Promise<GovtPaddyInwardResponse> => {
    const response = await apiClient.post<ApiResponse<GovtPaddyInwardResponse>>(
        GOVT_PADDY_INWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing govt paddy inward entry
 */
export const updateGovtPaddyInward = async (
    millId: string,
    { id, ...data }: UpdateGovtPaddyInwardRequest
): Promise<GovtPaddyInwardResponse> => {
    const response = await apiClient.put<ApiResponse<GovtPaddyInwardResponse>>(
        `${GOVT_PADDY_INWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a govt paddy inward entry
 */
export const deleteGovtPaddyInward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${GOVT_PADDY_INWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete govt paddy inward entries
 */
export const bulkDeleteGovtPaddyInward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${GOVT_PADDY_INWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export govt paddy inward entries to CSV/Excel
 */
export const exportGovtPaddyInward = async (
    millId: string,
    params?: GovtPaddyInwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${GOVT_PADDY_INWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
