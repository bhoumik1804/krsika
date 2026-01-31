/**
 * Khanda Outward Service
 * API client for Khanda Outward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    KhandaOutwardResponse,
    KhandaOutwardListResponse,
    KhandaOutwardSummaryResponse,
    CreateKhandaOutwardRequest,
    UpdateKhandaOutwardRequest,
    KhandaOutwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const KHANDA_OUTWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/khanda-outward`

// ==========================================
// Khanda Outward API Functions
// ==========================================

/**
 * Fetch all khanda outward entries with pagination and filters
 */
export const fetchKhandaOutwardList = async (
    millId: string,
    params?: KhandaOutwardQueryParams
): Promise<KhandaOutwardListResponse> => {
    const response = await apiClient.get<
        ApiResponse<KhandaOutwardListResponse>
    >(KHANDA_OUTWARD_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single khanda outward entry by ID
 */
export const fetchKhandaOutwardById = async (
    millId: string,
    id: string
): Promise<KhandaOutwardResponse> => {
    const response = await apiClient.get<ApiResponse<KhandaOutwardResponse>>(
        `${KHANDA_OUTWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch khanda outward summary/statistics
 */
export const fetchKhandaOutwardSummary = async (
    millId: string,
    params?: Pick<KhandaOutwardQueryParams, 'startDate' | 'endDate'>
): Promise<KhandaOutwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<KhandaOutwardSummaryResponse>
    >(`${KHANDA_OUTWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new khanda outward entry
 */
export const createKhandaOutward = async (
    millId: string,
    data: CreateKhandaOutwardRequest
): Promise<KhandaOutwardResponse> => {
    const response = await apiClient.post<ApiResponse<KhandaOutwardResponse>>(
        KHANDA_OUTWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing khanda outward entry
 */
export const updateKhandaOutward = async (
    millId: string,
    { id, ...data }: UpdateKhandaOutwardRequest
): Promise<KhandaOutwardResponse> => {
    const response = await apiClient.put<ApiResponse<KhandaOutwardResponse>>(
        `${KHANDA_OUTWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a khanda outward entry
 */
export const deleteKhandaOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${KHANDA_OUTWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete khanda outward entries
 */
export const bulkDeleteKhandaOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${KHANDA_OUTWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export khanda outward entries to CSV/Excel
 */
export const exportKhandaOutward = async (
    millId: string,
    params?: KhandaOutwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${KHANDA_OUTWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
