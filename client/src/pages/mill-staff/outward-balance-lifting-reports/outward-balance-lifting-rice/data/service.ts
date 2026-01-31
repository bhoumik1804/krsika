/**
 * Outward Balance Lifting Rice Service
 * API client for Outward Balance Lifting Rice CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    OutwardBalanceLiftingRiceResponse,
    OutwardBalanceLiftingRiceListResponse,
    OutwardBalanceLiftingRiceSummaryResponse,
    CreateOutwardBalanceLiftingRiceRequest,
    UpdateOutwardBalanceLiftingRiceRequest,
    OutwardBalanceLiftingRiceQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const OUTWARD_BALANCE_LIFTING_RICE_ENDPOINT = (millId: string) =>
    `/mills/${millId}/outward-balance-lifting-rice`

// ==========================================
// Outward Balance Lifting Rice API Functions
// ==========================================

/**
 * Fetch all outward balance lifting rice entries with pagination and filters
 */
export const fetchOutwardBalanceLiftingRiceList = async (
    millId: string,
    params?: OutwardBalanceLiftingRiceQueryParams
): Promise<OutwardBalanceLiftingRiceListResponse> => {
    const response = await apiClient.get<
        ApiResponse<OutwardBalanceLiftingRiceListResponse>
    >(OUTWARD_BALANCE_LIFTING_RICE_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single outward balance lifting rice entry by ID
 */
export const fetchOutwardBalanceLiftingRiceById = async (
    millId: string,
    id: string
): Promise<OutwardBalanceLiftingRiceResponse> => {
    const response = await apiClient.get<
        ApiResponse<OutwardBalanceLiftingRiceResponse>
    >(`${OUTWARD_BALANCE_LIFTING_RICE_ENDPOINT(millId)}/${id}`)
    return response.data.data
}

/**
 * Fetch outward balance lifting rice summary/statistics
 */
export const fetchOutwardBalanceLiftingRiceSummary = async (
    millId: string
): Promise<OutwardBalanceLiftingRiceSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<OutwardBalanceLiftingRiceSummaryResponse>
    >(`${OUTWARD_BALANCE_LIFTING_RICE_ENDPOINT(millId)}/summary`)
    return response.data.data
}

/**
 * Create a new outward balance lifting rice entry
 */
export const createOutwardBalanceLiftingRice = async (
    millId: string,
    data: CreateOutwardBalanceLiftingRiceRequest
): Promise<OutwardBalanceLiftingRiceResponse> => {
    const response = await apiClient.post<
        ApiResponse<OutwardBalanceLiftingRiceResponse>
    >(OUTWARD_BALANCE_LIFTING_RICE_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing outward balance lifting rice entry
 */
export const updateOutwardBalanceLiftingRice = async (
    millId: string,
    { id, ...data }: UpdateOutwardBalanceLiftingRiceRequest
): Promise<OutwardBalanceLiftingRiceResponse> => {
    const response = await apiClient.put<
        ApiResponse<OutwardBalanceLiftingRiceResponse>
    >(`${OUTWARD_BALANCE_LIFTING_RICE_ENDPOINT(millId)}/${id}`, data)
    return response.data.data
}

/**
 * Delete an outward balance lifting rice entry
 */
export const deleteOutwardBalanceLiftingRice = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(
        `${OUTWARD_BALANCE_LIFTING_RICE_ENDPOINT(millId)}/${id}`
    )
}

/**
 * Bulk delete outward balance lifting rice entries
 */
export const bulkDeleteOutwardBalanceLiftingRice = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(
        `${OUTWARD_BALANCE_LIFTING_RICE_ENDPOINT(millId)}/bulk`,
        {
            data: { ids },
        }
    )
}

/**
 * Export outward balance lifting rice entries to CSV/Excel
 */
export const exportOutwardBalanceLiftingRice = async (
    millId: string,
    params?: OutwardBalanceLiftingRiceQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${OUTWARD_BALANCE_LIFTING_RICE_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
