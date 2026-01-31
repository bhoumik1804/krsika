/**
 * Paddy Purchase Service
 * API client for Paddy Purchase CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    PaddyPurchaseResponse,
    PaddyPurchaseListResponse,
    PaddyPurchaseSummaryResponse,
    CreatePaddyPurchaseRequest,
    UpdatePaddyPurchaseRequest,
    PaddyPurchaseQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const PADDY_PURCHASE_ENDPOINT = (millId: string) =>
    `/mills/${millId}/paddy-purchase`

// ==========================================
// Paddy Purchase API Functions
// ==========================================

/**
 * Fetch all paddy purchase entries with pagination and filters
 */
export const fetchPaddyPurchaseList = async (
    millId: string,
    params?: PaddyPurchaseQueryParams
): Promise<PaddyPurchaseListResponse> => {
    const response = await apiClient.get<
        ApiResponse<PaddyPurchaseListResponse>
    >(PADDY_PURCHASE_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single paddy purchase entry by ID
 */
export const fetchPaddyPurchaseById = async (
    millId: string,
    id: string
): Promise<PaddyPurchaseResponse> => {
    const response = await apiClient.get<ApiResponse<PaddyPurchaseResponse>>(
        `${PADDY_PURCHASE_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch paddy purchase summary/statistics
 */
export const fetchPaddyPurchaseSummary = async (
    millId: string,
    params?: Pick<PaddyPurchaseQueryParams, 'startDate' | 'endDate'>
): Promise<PaddyPurchaseSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<PaddyPurchaseSummaryResponse>
    >(`${PADDY_PURCHASE_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new paddy purchase entry
 */
export const createPaddyPurchase = async (
    millId: string,
    data: CreatePaddyPurchaseRequest
): Promise<PaddyPurchaseResponse> => {
    const response = await apiClient.post<ApiResponse<PaddyPurchaseResponse>>(
        PADDY_PURCHASE_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing paddy purchase entry
 */
export const updatePaddyPurchase = async (
    millId: string,
    { id, ...data }: UpdatePaddyPurchaseRequest
): Promise<PaddyPurchaseResponse> => {
    const response = await apiClient.put<ApiResponse<PaddyPurchaseResponse>>(
        `${PADDY_PURCHASE_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a paddy purchase entry
 */
export const deletePaddyPurchase = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${PADDY_PURCHASE_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete paddy purchase entries
 */
export const bulkDeletePaddyPurchase = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${PADDY_PURCHASE_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export paddy purchase entries to CSV/Excel
 */
export const exportPaddyPurchase = async (
    millId: string,
    params?: PaddyPurchaseQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${PADDY_PURCHASE_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
