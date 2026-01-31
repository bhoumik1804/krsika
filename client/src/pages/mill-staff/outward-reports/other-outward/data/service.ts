/**
 * Other Outward Service
 * API client for Other Outward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    OtherOutwardResponse,
    OtherOutwardListResponse,
    OtherOutwardSummaryResponse,
    CreateOtherOutwardRequest,
    UpdateOtherOutwardRequest,
    OtherOutwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const OTHER_OUTWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/other-outward`

// ==========================================
// Other Outward API Functions
// ==========================================

/**
 * Fetch all other outward entries with pagination and filters
 */
export const fetchOtherOutwardList = async (
    millId: string,
    params?: OtherOutwardQueryParams
): Promise<OtherOutwardListResponse> => {
    const response = await apiClient.get<ApiResponse<OtherOutwardListResponse>>(
        OTHER_OUTWARD_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single other outward entry by ID
 */
export const fetchOtherOutwardById = async (
    millId: string,
    id: string
): Promise<OtherOutwardResponse> => {
    const response = await apiClient.get<ApiResponse<OtherOutwardResponse>>(
        `${OTHER_OUTWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch other outward summary/statistics
 */
export const fetchOtherOutwardSummary = async (
    millId: string,
    params?: Pick<OtherOutwardQueryParams, 'startDate' | 'endDate'>
): Promise<OtherOutwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<OtherOutwardSummaryResponse>
    >(`${OTHER_OUTWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new other outward entry
 */
export const createOtherOutward = async (
    millId: string,
    data: CreateOtherOutwardRequest
): Promise<OtherOutwardResponse> => {
    const response = await apiClient.post<ApiResponse<OtherOutwardResponse>>(
        OTHER_OUTWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing other outward entry
 */
export const updateOtherOutward = async (
    millId: string,
    { id, ...data }: UpdateOtherOutwardRequest
): Promise<OtherOutwardResponse> => {
    const response = await apiClient.put<ApiResponse<OtherOutwardResponse>>(
        `${OTHER_OUTWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete an other outward entry
 */
export const deleteOtherOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${OTHER_OUTWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete other outward entries
 */
export const bulkDeleteOtherOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${OTHER_OUTWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export other outward entries to CSV/Excel
 */
export const exportOtherOutward = async (
    millId: string,
    params?: OtherOutwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${OTHER_OUTWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
