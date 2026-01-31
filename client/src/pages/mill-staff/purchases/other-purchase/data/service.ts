/**
 * Other Purchase Service
 * API client for Other Purchase CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    OtherPurchaseResponse,
    OtherPurchaseListResponse,
    OtherPurchaseSummaryResponse,
    CreateOtherPurchaseRequest,
    UpdateOtherPurchaseRequest,
    OtherPurchaseQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const OTHER_PURCHASE_ENDPOINT = (millId: string) =>
    `/mills/${millId}/other-purchase`

// ==========================================
// Other Purchase API Functions
// ==========================================

/**
 * Fetch all other purchase entries with pagination and filters
 */
export const fetchOtherPurchaseList = async (
    millId: string,
    params?: OtherPurchaseQueryParams
): Promise<OtherPurchaseListResponse> => {
    const response = await apiClient.get<
        ApiResponse<OtherPurchaseListResponse>
    >(OTHER_PURCHASE_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single other purchase entry by ID
 */
export const fetchOtherPurchaseById = async (
    millId: string,
    id: string
): Promise<OtherPurchaseResponse> => {
    const response = await apiClient.get<ApiResponse<OtherPurchaseResponse>>(
        `${OTHER_PURCHASE_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch other purchase summary/statistics
 */
export const fetchOtherPurchaseSummary = async (
    millId: string,
    params?: Pick<OtherPurchaseQueryParams, 'startDate' | 'endDate'>
): Promise<OtherPurchaseSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<OtherPurchaseSummaryResponse>
    >(`${OTHER_PURCHASE_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new other purchase entry
 */
export const createOtherPurchase = async (
    millId: string,
    data: CreateOtherPurchaseRequest
): Promise<OtherPurchaseResponse> => {
    const response = await apiClient.post<ApiResponse<OtherPurchaseResponse>>(
        OTHER_PURCHASE_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing other purchase entry
 */
export const updateOtherPurchase = async (
    millId: string,
    { id, ...data }: UpdateOtherPurchaseRequest
): Promise<OtherPurchaseResponse> => {
    const response = await apiClient.put<ApiResponse<OtherPurchaseResponse>>(
        `${OTHER_PURCHASE_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a other purchase entry
 */
export const deleteOtherPurchase = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${OTHER_PURCHASE_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete other purchase entries
 */
export const bulkDeleteOtherPurchase = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${OTHER_PURCHASE_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export other purchase entries to CSV/Excel
 */
export const exportOtherPurchase = async (
    millId: string,
    params?: OtherPurchaseQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${OTHER_PURCHASE_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
