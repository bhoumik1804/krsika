/**
 * Labour Other Service
 * API client for Labour Other CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    LabourOtherResponse,
    LabourOtherListResponse,
    LabourOtherSummaryResponse,
    CreateLabourOtherRequest,
    UpdateLabourOtherRequest,
    LabourOtherQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const LABOUR_OTHER_ENDPOINT = (millId: string) =>
    `/mills/${millId}/labour-other`

// ==========================================
// Labour Other API Functions
// ==========================================

/**
 * Fetch all labour other entries with pagination and filters
 */
export const fetchLabourOtherList = async (
    millId: string,
    params?: LabourOtherQueryParams
): Promise<LabourOtherListResponse> => {
    const response = await apiClient.get<ApiResponse<LabourOtherListResponse>>(
        LABOUR_OTHER_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single labour other entry by ID
 */
export const fetchLabourOtherById = async (
    millId: string,
    id: string
): Promise<LabourOtherResponse> => {
    const response = await apiClient.get<ApiResponse<LabourOtherResponse>>(
        `${LABOUR_OTHER_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch labour other summary/statistics
 */
export const fetchLabourOtherSummary = async (
    millId: string,
    params?: Pick<LabourOtherQueryParams, 'startDate' | 'endDate'>
): Promise<LabourOtherSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<LabourOtherSummaryResponse>
    >(`${LABOUR_OTHER_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new labour other entry
 */
export const createLabourOther = async (
    millId: string,
    data: CreateLabourOtherRequest
): Promise<LabourOtherResponse> => {
    const response = await apiClient.post<ApiResponse<LabourOtherResponse>>(
        LABOUR_OTHER_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing labour other entry
 */
export const updateLabourOther = async (
    millId: string,
    { id, ...data }: UpdateLabourOtherRequest
): Promise<LabourOtherResponse> => {
    const response = await apiClient.put<ApiResponse<LabourOtherResponse>>(
        `${LABOUR_OTHER_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a labour other entry
 */
export const deleteLabourOther = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${LABOUR_OTHER_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete labour other entries
 */
export const bulkDeleteLabourOther = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${LABOUR_OTHER_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export labour other entries to CSV/Excel
 */
export const exportLabourOther = async (
    millId: string,
    params?: LabourOtherQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${LABOUR_OTHER_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
