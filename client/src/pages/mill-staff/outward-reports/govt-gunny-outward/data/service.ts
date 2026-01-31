/**
 * Govt Gunny Outward Service
 * API client for Govt Gunny Outward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    GovtGunnyOutwardResponse,
    GovtGunnyOutwardListResponse,
    GovtGunnyOutwardSummaryResponse,
    CreateGovtGunnyOutwardRequest,
    UpdateGovtGunnyOutwardRequest,
    GovtGunnyOutwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const GOVT_GUNNY_OUTWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/govt-gunny-outward`

// ==========================================
// Govt Gunny Outward API Functions
// ==========================================

/**
 * Fetch all govt gunny outward entries with pagination and filters
 */
export const fetchGovtGunnyOutwardList = async (
    millId: string,
    params?: GovtGunnyOutwardQueryParams
): Promise<GovtGunnyOutwardListResponse> => {
    const response = await apiClient.get<
        ApiResponse<GovtGunnyOutwardListResponse>
    >(GOVT_GUNNY_OUTWARD_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single govt gunny outward entry by ID
 */
export const fetchGovtGunnyOutwardById = async (
    millId: string,
    id: string
): Promise<GovtGunnyOutwardResponse> => {
    const response = await apiClient.get<ApiResponse<GovtGunnyOutwardResponse>>(
        `${GOVT_GUNNY_OUTWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch govt gunny outward summary/statistics
 */
export const fetchGovtGunnyOutwardSummary = async (
    millId: string,
    params?: Pick<GovtGunnyOutwardQueryParams, 'startDate' | 'endDate'>
): Promise<GovtGunnyOutwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<GovtGunnyOutwardSummaryResponse>
    >(`${GOVT_GUNNY_OUTWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new govt gunny outward entry
 */
export const createGovtGunnyOutward = async (
    millId: string,
    data: CreateGovtGunnyOutwardRequest
): Promise<GovtGunnyOutwardResponse> => {
    const response = await apiClient.post<
        ApiResponse<GovtGunnyOutwardResponse>
    >(GOVT_GUNNY_OUTWARD_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing govt gunny outward entry
 */
export const updateGovtGunnyOutward = async (
    millId: string,
    { id, ...data }: UpdateGovtGunnyOutwardRequest
): Promise<GovtGunnyOutwardResponse> => {
    const response = await apiClient.put<ApiResponse<GovtGunnyOutwardResponse>>(
        `${GOVT_GUNNY_OUTWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a govt gunny outward entry
 */
export const deleteGovtGunnyOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${GOVT_GUNNY_OUTWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete govt gunny outward entries
 */
export const bulkDeleteGovtGunnyOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.post(`${GOVT_GUNNY_OUTWARD_ENDPOINT(millId)}/bulk-delete`, {
        ids,
    })
}

/**
 * Export govt gunny outward entries
 */
export const exportGovtGunnyOutward = async (
    millId: string,
    params?: GovtGunnyOutwardQueryParams,
    format: 'csv' | 'xlsx' = 'xlsx'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${GOVT_GUNNY_OUTWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
