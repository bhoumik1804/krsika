/**
 * Other Inward Service
 * API client for Other Inward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    OtherInwardResponse,
    OtherInwardListResponse,
    OtherInwardSummaryResponse,
    CreateOtherInwardRequest,
    UpdateOtherInwardRequest,
    OtherInwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const OTHER_INWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/other-inward`

// ==========================================
// Other Inward API Functions
// ==========================================

/**
 * Fetch all other inward entries with pagination and filters
 */
export const fetchOtherInwardList = async (
    millId: string,
    params?: OtherInwardQueryParams
): Promise<OtherInwardListResponse> => {
    const response = await apiClient.get<ApiResponse<OtherInwardListResponse>>(
        OTHER_INWARD_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single other inward entry by ID
 */
export const fetchOtherInwardById = async (
    millId: string,
    id: string
): Promise<OtherInwardResponse> => {
    const response = await apiClient.get<ApiResponse<OtherInwardResponse>>(
        `${OTHER_INWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch other inward summary/statistics
 */
export const fetchOtherInwardSummary = async (
    millId: string,
    params?: Pick<OtherInwardQueryParams, 'startDate' | 'endDate'>
): Promise<OtherInwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<OtherInwardSummaryResponse>
    >(`${OTHER_INWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new other inward entry
 */
export const createOtherInward = async (
    millId: string,
    data: CreateOtherInwardRequest
): Promise<OtherInwardResponse> => {
    const response = await apiClient.post<ApiResponse<OtherInwardResponse>>(
        OTHER_INWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing other inward entry
 */
export const updateOtherInward = async (
    millId: string,
    { id, ...data }: UpdateOtherInwardRequest
): Promise<OtherInwardResponse> => {
    const response = await apiClient.put<ApiResponse<OtherInwardResponse>>(
        `${OTHER_INWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete an other inward entry
 */
export const deleteOtherInward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${OTHER_INWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete other inward entries
 */
export const bulkDeleteOtherInward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${OTHER_INWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export other inward entries to CSV/Excel
 */
export const exportOtherInward = async (
    millId: string,
    params?: OtherInwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${OTHER_INWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
