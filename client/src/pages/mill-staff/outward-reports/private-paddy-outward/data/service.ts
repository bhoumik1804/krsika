/**
 * Private Paddy Outward Service
 * API client for Private Paddy Outward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    PrivatePaddyOutwardResponse,
    PrivatePaddyOutwardListResponse,
    PrivatePaddyOutwardSummaryResponse,
    CreatePrivatePaddyOutwardRequest,
    UpdatePrivatePaddyOutwardRequest,
    PrivatePaddyOutwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const PRIVATE_PADDY_OUTWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/private-paddy-outward`

// ==========================================
// Private Paddy Outward API Functions
// ==========================================

/**
 * Fetch all private paddy outward entries with pagination and filters
 */
export const fetchPrivatePaddyOutwardList = async (
    millId: string,
    params?: PrivatePaddyOutwardQueryParams
): Promise<PrivatePaddyOutwardListResponse> => {
    const response = await apiClient.get<
        ApiResponse<PrivatePaddyOutwardListResponse>
    >(PRIVATE_PADDY_OUTWARD_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single private paddy outward entry by ID
 */
export const fetchPrivatePaddyOutwardById = async (
    millId: string,
    id: string
): Promise<PrivatePaddyOutwardResponse> => {
    const response = await apiClient.get<
        ApiResponse<PrivatePaddyOutwardResponse>
    >(`${PRIVATE_PADDY_OUTWARD_ENDPOINT(millId)}/${id}`)
    return response.data.data
}

/**
 * Fetch private paddy outward summary/statistics
 */
export const fetchPrivatePaddyOutwardSummary = async (
    millId: string,
    params?: Pick<PrivatePaddyOutwardQueryParams, 'startDate' | 'endDate'>
): Promise<PrivatePaddyOutwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<PrivatePaddyOutwardSummaryResponse>
    >(`${PRIVATE_PADDY_OUTWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new private paddy outward entry
 */
export const createPrivatePaddyOutward = async (
    millId: string,
    data: CreatePrivatePaddyOutwardRequest
): Promise<PrivatePaddyOutwardResponse> => {
    const response = await apiClient.post<
        ApiResponse<PrivatePaddyOutwardResponse>
    >(PRIVATE_PADDY_OUTWARD_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing private paddy outward entry
 */
export const updatePrivatePaddyOutward = async (
    millId: string,
    { id, ...data }: UpdatePrivatePaddyOutwardRequest
): Promise<PrivatePaddyOutwardResponse> => {
    const response = await apiClient.put<
        ApiResponse<PrivatePaddyOutwardResponse>
    >(`${PRIVATE_PADDY_OUTWARD_ENDPOINT(millId)}/${id}`, data)
    return response.data.data
}

/**
 * Delete a private paddy outward entry
 */
export const deletePrivatePaddyOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${PRIVATE_PADDY_OUTWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete private paddy outward entries
 */
export const bulkDeletePrivatePaddyOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${PRIVATE_PADDY_OUTWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export private paddy outward entries to CSV/Excel
 */
export const exportPrivatePaddyOutward = async (
    millId: string,
    params?: PrivatePaddyOutwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${PRIVATE_PADDY_OUTWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
