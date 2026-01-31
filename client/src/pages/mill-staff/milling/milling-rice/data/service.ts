/**
 * Milling Rice Service
 * API client for Milling Rice CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    MillingRiceResponse,
    MillingRiceListResponse,
    MillingRiceSummaryResponse,
    CreateMillingRiceRequest,
    UpdateMillingRiceRequest,
    MillingRiceQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const MILLING_RICE_ENDPOINT = (millId: string) =>
    `/mills/${millId}/milling-rice`

// ==========================================
// Milling Rice API Functions
// ==========================================

/**
 * Fetch all milling rice entries with pagination and filters
 */
export const fetchMillingRiceList = async (
    millId: string,
    params?: MillingRiceQueryParams
): Promise<MillingRiceListResponse> => {
    const response = await apiClient.get<ApiResponse<MillingRiceListResponse>>(
        MILLING_RICE_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single milling rice entry by ID
 */
export const fetchMillingRiceById = async (
    millId: string,
    id: string
): Promise<MillingRiceResponse> => {
    const response = await apiClient.get<ApiResponse<MillingRiceResponse>>(
        `${MILLING_RICE_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch milling rice summary/statistics
 */
export const fetchMillingRiceSummary = async (
    millId: string,
    params?: Pick<MillingRiceQueryParams, 'startDate' | 'endDate'>
): Promise<MillingRiceSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<MillingRiceSummaryResponse>
    >(`${MILLING_RICE_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new milling rice entry
 */
export const createMillingRice = async (
    millId: string,
    data: CreateMillingRiceRequest
): Promise<MillingRiceResponse> => {
    const response = await apiClient.post<ApiResponse<MillingRiceResponse>>(
        MILLING_RICE_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing milling rice entry
 */
export const updateMillingRice = async (
    millId: string,
    { id, ...data }: UpdateMillingRiceRequest
): Promise<MillingRiceResponse> => {
    const response = await apiClient.put<ApiResponse<MillingRiceResponse>>(
        `${MILLING_RICE_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a milling rice entry
 */
export const deleteMillingRice = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${MILLING_RICE_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete milling rice entries
 */
export const bulkDeleteMillingRice = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${MILLING_RICE_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export milling rice entries to CSV/Excel
 */
export const exportMillingRice = async (
    millId: string,
    params?: MillingRiceQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${MILLING_RICE_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
