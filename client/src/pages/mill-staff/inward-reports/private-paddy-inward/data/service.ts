/**
 * Private Paddy Inward Service
 * API client for Private Paddy Inward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    PrivatePaddyInwardResponse,
    PrivatePaddyInwardListResponse,
    PrivatePaddyInwardSummaryResponse,
    CreatePrivatePaddyInwardRequest,
    UpdatePrivatePaddyInwardRequest,
    PrivatePaddyInwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const PRIVATE_PADDY_INWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/private-paddy-inward`

// ==========================================
// Private Paddy Inward API Functions
// ==========================================

/**
 * Fetch all private paddy inward entries with pagination and filters
 */
export const fetchPrivatePaddyInwardList = async (
    millId: string,
    params?: PrivatePaddyInwardQueryParams
): Promise<PrivatePaddyInwardListResponse> => {
    const response = await apiClient.get<
        ApiResponse<PrivatePaddyInwardListResponse>
    >(PRIVATE_PADDY_INWARD_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single private paddy inward entry by ID
 */
export const fetchPrivatePaddyInwardById = async (
    millId: string,
    id: string
): Promise<PrivatePaddyInwardResponse> => {
    const response = await apiClient.get<
        ApiResponse<PrivatePaddyInwardResponse>
    >(`${PRIVATE_PADDY_INWARD_ENDPOINT(millId)}/${id}`)
    return response.data.data
}

/**
 * Fetch private paddy inward summary/statistics
 */
export const fetchPrivatePaddyInwardSummary = async (
    millId: string,
    params?: Pick<PrivatePaddyInwardQueryParams, 'startDate' | 'endDate'>
): Promise<PrivatePaddyInwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<PrivatePaddyInwardSummaryResponse>
    >(`${PRIVATE_PADDY_INWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new private paddy inward entry
 */
export const createPrivatePaddyInward = async (
    millId: string,
    data: CreatePrivatePaddyInwardRequest
): Promise<PrivatePaddyInwardResponse> => {
    const response = await apiClient.post<
        ApiResponse<PrivatePaddyInwardResponse>
    >(PRIVATE_PADDY_INWARD_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing private paddy inward entry
 */
export const updatePrivatePaddyInward = async (
    millId: string,
    { id, ...data }: UpdatePrivatePaddyInwardRequest
): Promise<PrivatePaddyInwardResponse> => {
    const response = await apiClient.put<
        ApiResponse<PrivatePaddyInwardResponse>
    >(`${PRIVATE_PADDY_INWARD_ENDPOINT(millId)}/${id}`, data)
    return response.data.data
}

/**
 * Delete a private paddy inward entry
 */
export const deletePrivatePaddyInward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${PRIVATE_PADDY_INWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete private paddy inward entries
 */
export const bulkDeletePrivatePaddyInward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${PRIVATE_PADDY_INWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export private paddy inward entries to CSV/Excel
 */
export const exportPrivatePaddyInward = async (
    millId: string,
    params?: PrivatePaddyInwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${PRIVATE_PADDY_INWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
