/**
 * Govt Rice Outward Service
 * API client for Govt Rice Outward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    GovtRiceOutwardResponse,
    GovtRiceOutwardListResponse,
    GovtRiceOutwardSummaryResponse,
    CreateGovtRiceOutwardRequest,
    UpdateGovtRiceOutwardRequest,
    GovtRiceOutwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const GOVT_RICE_OUTWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/govt-rice-outward`

// ==========================================
// Govt Rice Outward API Functions
// ==========================================

/**
 * Fetch all govt rice outward entries with pagination and filters
 */
export const fetchGovtRiceOutwardList = async (
    millId: string,
    params?: GovtRiceOutwardQueryParams
): Promise<GovtRiceOutwardListResponse> => {
    const response = await apiClient.get<
        ApiResponse<GovtRiceOutwardListResponse>
    >(GOVT_RICE_OUTWARD_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single govt rice outward entry by ID
 */
export const fetchGovtRiceOutwardById = async (
    millId: string,
    id: string
): Promise<GovtRiceOutwardResponse> => {
    const response = await apiClient.get<ApiResponse<GovtRiceOutwardResponse>>(
        `${GOVT_RICE_OUTWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch govt rice outward summary/statistics
 */
export const fetchGovtRiceOutwardSummary = async (
    millId: string,
    params?: Pick<GovtRiceOutwardQueryParams, 'startDate' | 'endDate'>
): Promise<GovtRiceOutwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<GovtRiceOutwardSummaryResponse>
    >(`${GOVT_RICE_OUTWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new govt rice outward entry
 */
export const createGovtRiceOutward = async (
    millId: string,
    data: CreateGovtRiceOutwardRequest
): Promise<GovtRiceOutwardResponse> => {
    const response = await apiClient.post<ApiResponse<GovtRiceOutwardResponse>>(
        GOVT_RICE_OUTWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing govt rice outward entry
 */
export const updateGovtRiceOutward = async (
    millId: string,
    { id, ...data }: UpdateGovtRiceOutwardRequest
): Promise<GovtRiceOutwardResponse> => {
    const response = await apiClient.put<ApiResponse<GovtRiceOutwardResponse>>(
        `${GOVT_RICE_OUTWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a govt rice outward entry
 */
export const deleteGovtRiceOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${GOVT_RICE_OUTWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete govt rice outward entries
 */
export const bulkDeleteGovtRiceOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${GOVT_RICE_OUTWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export govt rice outward entries to CSV/Excel
 */
export const exportGovtRiceOutward = async (
    millId: string,
    params?: GovtRiceOutwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${GOVT_RICE_OUTWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
