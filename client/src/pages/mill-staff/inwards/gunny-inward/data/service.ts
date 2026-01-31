/**
 * Gunny Inward Service
 * API client for Gunny Inward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    GunnyInwardResponse,
    GunnyInwardListResponse,
    GunnyInwardSummaryResponse,
    CreateGunnyInwardRequest,
    UpdateGunnyInwardRequest,
    GunnyInwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const GUNNY_INWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/gunny-inward`

// ==========================================
// Gunny Inward API Functions
// ==========================================

/**
 * Fetch all gunny inward entries with pagination and filters
 */
export const fetchGunnyInwardList = async (
    millId: string,
    params?: GunnyInwardQueryParams
): Promise<GunnyInwardListResponse> => {
    const response = await apiClient.get<ApiResponse<GunnyInwardListResponse>>(
        GUNNY_INWARD_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single gunny inward entry by ID
 */
export const fetchGunnyInwardById = async (
    millId: string,
    id: string
): Promise<GunnyInwardResponse> => {
    const response = await apiClient.get<ApiResponse<GunnyInwardResponse>>(
        `${GUNNY_INWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch gunny inward summary/statistics
 */
export const fetchGunnyInwardSummary = async (
    millId: string,
    params?: Pick<GunnyInwardQueryParams, 'startDate' | 'endDate'>
): Promise<GunnyInwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<GunnyInwardSummaryResponse>
    >(`${GUNNY_INWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new gunny inward entry
 */
export const createGunnyInward = async (
    millId: string,
    data: CreateGunnyInwardRequest
): Promise<GunnyInwardResponse> => {
    const response = await apiClient.post<ApiResponse<GunnyInwardResponse>>(
        GUNNY_INWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing gunny inward entry
 */
export const updateGunnyInward = async (
    millId: string,
    { id, ...data }: UpdateGunnyInwardRequest
): Promise<GunnyInwardResponse> => {
    const response = await apiClient.put<ApiResponse<GunnyInwardResponse>>(
        `${GUNNY_INWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a gunny inward entry
 */
export const deleteGunnyInward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${GUNNY_INWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete gunny inward entries
 */
export const bulkDeleteGunnyInward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${GUNNY_INWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export gunny inward entries to CSV/Excel
 */
export const exportGunnyInward = async (
    millId: string,
    params?: GunnyInwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${GUNNY_INWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
