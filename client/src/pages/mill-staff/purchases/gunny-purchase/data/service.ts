/**
 * Gunny Purchase Service
 * API client for Gunny Purchase CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    GunnyPurchaseResponse,
    GunnyPurchaseListResponse,
    GunnyPurchaseSummaryResponse,
    CreateGunnyPurchaseRequest,
    UpdateGunnyPurchaseRequest,
    GunnyPurchaseQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const GUNNY_PURCHASE_ENDPOINT = (millId: string) =>
    `/mills/${millId}/gunny-purchase`

// ==========================================
// Gunny Purchase API Functions
// ==========================================

/**
 * Fetch all gunny purchase entries with pagination and filters
 */
export const fetchGunnyPurchaseList = async (
    millId: string,
    params?: GunnyPurchaseQueryParams
): Promise<GunnyPurchaseListResponse> => {
    const response = await apiClient.get<
        ApiResponse<GunnyPurchaseListResponse>
    >(GUNNY_PURCHASE_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single gunny purchase entry by ID
 */
export const fetchGunnyPurchaseById = async (
    millId: string,
    id: string
): Promise<GunnyPurchaseResponse> => {
    const response = await apiClient.get<ApiResponse<GunnyPurchaseResponse>>(
        `${GUNNY_PURCHASE_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch gunny purchase summary/statistics
 */
export const fetchGunnyPurchaseSummary = async (
    millId: string,
    params?: Pick<GunnyPurchaseQueryParams, 'startDate' | 'endDate'>
): Promise<GunnyPurchaseSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<GunnyPurchaseSummaryResponse>
    >(`${GUNNY_PURCHASE_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new gunny purchase entry
 */
export const createGunnyPurchase = async (
    millId: string,
    data: CreateGunnyPurchaseRequest
): Promise<GunnyPurchaseResponse> => {
    const response = await apiClient.post<ApiResponse<GunnyPurchaseResponse>>(
        GUNNY_PURCHASE_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing gunny purchase entry
 */
export const updateGunnyPurchase = async (
    millId: string,
    { id, ...data }: UpdateGunnyPurchaseRequest
): Promise<GunnyPurchaseResponse> => {
    const response = await apiClient.put<ApiResponse<GunnyPurchaseResponse>>(
        `${GUNNY_PURCHASE_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a gunny purchase entry
 */
export const deleteGunnyPurchase = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${GUNNY_PURCHASE_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete gunny purchase entries
 */
export const bulkDeleteGunnyPurchase = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${GUNNY_PURCHASE_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export gunny purchase entries to CSV/Excel
 */
export const exportGunnyPurchase = async (
    millId: string,
    params?: GunnyPurchaseQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${GUNNY_PURCHASE_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
