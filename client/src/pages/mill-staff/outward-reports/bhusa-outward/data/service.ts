/**
 * Bhusa Outward Service
 * API client for Bhusa Outward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    BhusaOutwardResponse,
    BhusaOutwardListResponse,
    BhusaOutwardSummaryResponse,
    CreateBhusaOutwardRequest,
    UpdateBhusaOutwardRequest,
    BhusaOutwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const BHUSA_OUTWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/bhusa-outward`

// ==========================================
// Bhusa Outward API Functions
// ==========================================

/**
 * Fetch all bhusa outward entries with pagination and filters
 */
export const fetchBhusaOutwardList = async (
    millId: string,
    params?: BhusaOutwardQueryParams
): Promise<BhusaOutwardListResponse> => {
    const response = await apiClient.get<ApiResponse<BhusaOutwardListResponse>>(
        BHUSA_OUTWARD_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single bhusa outward entry by ID
 */
export const fetchBhusaOutwardById = async (
    millId: string,
    id: string
): Promise<BhusaOutwardResponse> => {
    const response = await apiClient.get<ApiResponse<BhusaOutwardResponse>>(
        `${BHUSA_OUTWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch bhusa outward summary/statistics
 */
export const fetchBhusaOutwardSummary = async (
    millId: string,
    params?: Pick<BhusaOutwardQueryParams, 'startDate' | 'endDate'>
): Promise<BhusaOutwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<BhusaOutwardSummaryResponse>
    >(`${BHUSA_OUTWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new bhusa outward entry
 */
export const createBhusaOutward = async (
    millId: string,
    data: CreateBhusaOutwardRequest
): Promise<BhusaOutwardResponse> => {
    const response = await apiClient.post<ApiResponse<BhusaOutwardResponse>>(
        BHUSA_OUTWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing bhusa outward entry
 */
export const updateBhusaOutward = async (
    millId: string,
    { id, ...data }: UpdateBhusaOutwardRequest
): Promise<BhusaOutwardResponse> => {
    const response = await apiClient.put<ApiResponse<BhusaOutwardResponse>>(
        `${BHUSA_OUTWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a bhusa outward entry
 */
export const deleteBhusaOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${BHUSA_OUTWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete bhusa outward entries
 */
export const bulkDeleteBhusaOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${BHUSA_OUTWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export bhusa outward entries to CSV/Excel
 */
export const exportBhusaOutward = async (
    millId: string,
    params?: BhusaOutwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${BHUSA_OUTWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
