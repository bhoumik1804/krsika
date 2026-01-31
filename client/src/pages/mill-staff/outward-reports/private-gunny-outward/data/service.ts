/**
 * Private Gunny Outward Service
 * API client for Private Gunny Outward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    PrivateGunnyOutwardResponse,
    PrivateGunnyOutwardListResponse,
    PrivateGunnyOutwardSummaryResponse,
    CreatePrivateGunnyOutwardRequest,
    UpdatePrivateGunnyOutwardRequest,
    PrivateGunnyOutwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const PRIVATE_GUNNY_OUTWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/private-gunny-outward`

// ==========================================
// Private Gunny Outward API Functions
// ==========================================

/**
 * Fetch all private gunny outward entries with pagination and filters
 */
export const fetchPrivateGunnyOutwardList = async (
    millId: string,
    params?: PrivateGunnyOutwardQueryParams
): Promise<PrivateGunnyOutwardListResponse> => {
    const response = await apiClient.get<
        ApiResponse<PrivateGunnyOutwardListResponse>
    >(PRIVATE_GUNNY_OUTWARD_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single private gunny outward entry by ID
 */
export const fetchPrivateGunnyOutwardById = async (
    millId: string,
    id: string
): Promise<PrivateGunnyOutwardResponse> => {
    const response = await apiClient.get<
        ApiResponse<PrivateGunnyOutwardResponse>
    >(`${PRIVATE_GUNNY_OUTWARD_ENDPOINT(millId)}/${id}`)
    return response.data.data
}

/**
 * Fetch private gunny outward summary/statistics
 */
export const fetchPrivateGunnyOutwardSummary = async (
    millId: string,
    params?: Pick<PrivateGunnyOutwardQueryParams, 'startDate' | 'endDate'>
): Promise<PrivateGunnyOutwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<PrivateGunnyOutwardSummaryResponse>
    >(`${PRIVATE_GUNNY_OUTWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new private gunny outward entry
 */
export const createPrivateGunnyOutward = async (
    millId: string,
    data: CreatePrivateGunnyOutwardRequest
): Promise<PrivateGunnyOutwardResponse> => {
    const response = await apiClient.post<
        ApiResponse<PrivateGunnyOutwardResponse>
    >(PRIVATE_GUNNY_OUTWARD_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing private gunny outward entry
 */
export const updatePrivateGunnyOutward = async (
    millId: string,
    { id, ...data }: UpdatePrivateGunnyOutwardRequest
): Promise<PrivateGunnyOutwardResponse> => {
    const response = await apiClient.put<
        ApiResponse<PrivateGunnyOutwardResponse>
    >(`${PRIVATE_GUNNY_OUTWARD_ENDPOINT(millId)}/${id}`, data)
    return response.data.data
}

/**
 * Delete a private gunny outward entry
 */
export const deletePrivateGunnyOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${PRIVATE_GUNNY_OUTWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete private gunny outward entries
 */
export const bulkDeletePrivateGunnyOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${PRIVATE_GUNNY_OUTWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export private gunny outward entries to CSV/Excel
 */
export const exportPrivateGunnyOutward = async (
    millId: string,
    params?: PrivateGunnyOutwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${PRIVATE_GUNNY_OUTWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
