/**
 * Private Rice Outward Service
 * API client for Private Rice Outward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    PrivateRiceOutwardResponse,
    PrivateRiceOutwardListResponse,
    PrivateRiceOutwardSummaryResponse,
    CreatePrivateRiceOutwardRequest,
    UpdatePrivateRiceOutwardRequest,
    PrivateRiceOutwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const PRIVATE_RICE_OUTWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/private-rice-outward`

// ==========================================
// Private Rice Outward API Functions
// ==========================================

/**
 * Fetch all private rice outward entries with pagination and filters
 */
export const fetchPrivateRiceOutwardList = async (
    millId: string,
    params?: PrivateRiceOutwardQueryParams
): Promise<PrivateRiceOutwardListResponse> => {
    const response = await apiClient.get<
        ApiResponse<PrivateRiceOutwardListResponse>
    >(PRIVATE_RICE_OUTWARD_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single private rice outward entry by ID
 */
export const fetchPrivateRiceOutwardById = async (
    millId: string,
    id: string
): Promise<PrivateRiceOutwardResponse> => {
    const response = await apiClient.get<
        ApiResponse<PrivateRiceOutwardResponse>
    >(`${PRIVATE_RICE_OUTWARD_ENDPOINT(millId)}/${id}`)
    return response.data.data
}

/**
 * Fetch private rice outward summary/statistics
 */
export const fetchPrivateRiceOutwardSummary = async (
    millId: string,
    params?: Pick<PrivateRiceOutwardQueryParams, 'startDate' | 'endDate'>
): Promise<PrivateRiceOutwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<PrivateRiceOutwardSummaryResponse>
    >(`${PRIVATE_RICE_OUTWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new private rice outward entry
 */
export const createPrivateRiceOutward = async (
    millId: string,
    data: CreatePrivateRiceOutwardRequest
): Promise<PrivateRiceOutwardResponse> => {
    const response = await apiClient.post<
        ApiResponse<PrivateRiceOutwardResponse>
    >(PRIVATE_RICE_OUTWARD_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing private rice outward entry
 */
export const updatePrivateRiceOutward = async (
    millId: string,
    { id, ...data }: UpdatePrivateRiceOutwardRequest
): Promise<PrivateRiceOutwardResponse> => {
    const response = await apiClient.put<
        ApiResponse<PrivateRiceOutwardResponse>
    >(`${PRIVATE_RICE_OUTWARD_ENDPOINT(millId)}/${id}`, data)
    return response.data.data
}

/**
 * Delete a private rice outward entry
 */
export const deletePrivateRiceOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${PRIVATE_RICE_OUTWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete private rice outward entries
 */
export const bulkDeletePrivateRiceOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${PRIVATE_RICE_OUTWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export private rice outward entries to CSV/Excel
 */
export const exportPrivateRiceOutward = async (
    millId: string,
    params?: PrivateRiceOutwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${PRIVATE_RICE_OUTWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
