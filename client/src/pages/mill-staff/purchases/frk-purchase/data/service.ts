/**
 * FRK Purchase Service
 * API client for FRK Purchase CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    FrkPurchaseResponse,
    FrkPurchaseListResponse,
    FrkPurchaseSummaryResponse,
    CreateFrkPurchaseRequest,
    UpdateFrkPurchaseRequest,
    FrkPurchaseQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const FRK_PURCHASE_ENDPOINT = (millId: string) =>
    `/mills/${millId}/frk-purchase`

// ==========================================
// FRK Purchase API Functions
// ==========================================

/**
 * Fetch all FRK purchase entries with pagination and filters
 */
export const fetchFrkPurchaseList = async (
    millId: string,
    params?: FrkPurchaseQueryParams
): Promise<FrkPurchaseListResponse> => {
    const response = await apiClient.get<ApiResponse<FrkPurchaseListResponse>>(
        FRK_PURCHASE_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single FRK purchase entry by ID
 */
export const fetchFrkPurchaseById = async (
    millId: string,
    id: string
): Promise<FrkPurchaseResponse> => {
    const response = await apiClient.get<ApiResponse<FrkPurchaseResponse>>(
        `${FRK_PURCHASE_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch FRK purchase summary/statistics
 */
export const fetchFrkPurchaseSummary = async (
    millId: string,
    params?: Pick<FrkPurchaseQueryParams, 'startDate' | 'endDate'>
): Promise<FrkPurchaseSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<FrkPurchaseSummaryResponse>
    >(`${FRK_PURCHASE_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new FRK purchase entry
 */
export const createFrkPurchase = async (
    millId: string,
    data: CreateFrkPurchaseRequest
): Promise<FrkPurchaseResponse> => {
    const response = await apiClient.post<ApiResponse<FrkPurchaseResponse>>(
        FRK_PURCHASE_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing FRK purchase entry
 */
export const updateFrkPurchase = async (
    millId: string,
    { id, ...data }: UpdateFrkPurchaseRequest
): Promise<FrkPurchaseResponse> => {
    const response = await apiClient.put<ApiResponse<FrkPurchaseResponse>>(
        `${FRK_PURCHASE_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a FRK purchase entry
 */
export const deleteFrkPurchase = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${FRK_PURCHASE_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete FRK purchase entries
 */
export const bulkDeleteFrkPurchase = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${FRK_PURCHASE_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export FRK purchase entries to CSV/Excel
 */
export const exportFrkPurchase = async (
    millId: string,
    params?: FrkPurchaseQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${FRK_PURCHASE_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
