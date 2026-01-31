/**
 * Rice Purchase Service
 * API client for Rice Purchase CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    RicePurchaseResponse,
    RicePurchaseListResponse,
    RicePurchaseSummaryResponse,
    CreateRicePurchaseRequest,
    UpdateRicePurchaseRequest,
    RicePurchaseQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const RICE_PURCHASE_ENDPOINT = (millId: string) =>
    `/mills/${millId}/rice-purchase`

// ==========================================
// Rice Purchase API Functions
// ==========================================

/**
 * Fetch all rice purchase entries with pagination and filters
 */
export const fetchRicePurchaseList = async (
    millId: string,
    params?: RicePurchaseQueryParams
): Promise<RicePurchaseListResponse> => {
    const response = await apiClient.get<ApiResponse<RicePurchaseListResponse>>(
        RICE_PURCHASE_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single rice purchase entry by ID
 */
export const fetchRicePurchaseById = async (
    millId: string,
    id: string
): Promise<RicePurchaseResponse> => {
    const response = await apiClient.get<ApiResponse<RicePurchaseResponse>>(
        `${RICE_PURCHASE_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch rice purchase summary/statistics
 */
export const fetchRicePurchaseSummary = async (
    millId: string,
    params?: Pick<RicePurchaseQueryParams, 'startDate' | 'endDate'>
): Promise<RicePurchaseSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<RicePurchaseSummaryResponse>
    >(`${RICE_PURCHASE_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new rice purchase entry
 */
export const createRicePurchase = async (
    millId: string,
    data: CreateRicePurchaseRequest
): Promise<RicePurchaseResponse> => {
    const response = await apiClient.post<ApiResponse<RicePurchaseResponse>>(
        RICE_PURCHASE_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing rice purchase entry
 */
export const updateRicePurchase = async (
    millId: string,
    { id, ...data }: UpdateRicePurchaseRequest
): Promise<RicePurchaseResponse> => {
    const response = await apiClient.put<ApiResponse<RicePurchaseResponse>>(
        `${RICE_PURCHASE_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a rice purchase entry
 */
export const deleteRicePurchase = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${RICE_PURCHASE_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete rice purchase entries
 */
export const bulkDeleteRicePurchase = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${RICE_PURCHASE_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export rice purchase entries to CSV/Excel
 */
export const exportRicePurchase = async (
    millId: string,
    params?: RicePurchaseQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${RICE_PURCHASE_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
