/**
 * Gunny Purchase Service
 * API client for Gunny Purchase CRUD operations (Mill Admin)
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    GunnyPurchaseResponse,
    GunnyPurchaseListResponse,
    CreateGunnyPurchaseRequest,
    UpdateGunnyPurchaseRequest,
    GunnyPurchaseQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const getGunnyEndpoint = (millId: string) => `/mills/${millId}/gunny-purchase`

// ==========================================
// Gunny Purchase CRUD API Functions
// ==========================================

/**
 * Fetch all gunny purchases with pagination and filters
 */
export const fetchGunnyPurchaseList = async (
    millId: string,
    params?: GunnyPurchaseQueryParams
): Promise<GunnyPurchaseListResponse> => {
    const response = await apiClient.get<
        ApiResponse<GunnyPurchaseListResponse>
    >(getGunnyEndpoint(millId), { params })
    return response.data.data
}

/**
 * Fetch a single gunny purchase by ID
 */
export const fetchGunnyPurchaseById = async (
    millId: string,
    id: string
): Promise<GunnyPurchaseResponse> => {
    const response = await apiClient.get<ApiResponse<GunnyPurchaseResponse>>(
        `${getGunnyEndpoint(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Create a new gunny purchase
 */
export const createGunnyPurchase = async (
    millId: string,
    data: CreateGunnyPurchaseRequest
): Promise<GunnyPurchaseResponse> => {
    const response = await apiClient.post<ApiResponse<GunnyPurchaseResponse>>(
        getGunnyEndpoint(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing gunny purchase
 */
export const updateGunnyPurchase = async (
    millId: string,
    { _id, ...data }: UpdateGunnyPurchaseRequest
): Promise<GunnyPurchaseResponse> => {
    const response = await apiClient.put<ApiResponse<GunnyPurchaseResponse>>(
        `${getGunnyEndpoint(millId)}/${_id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a gunny purchase
 */
export const deleteGunnyPurchase = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${getGunnyEndpoint(millId)}/${id}`)
}

/**
 * Bulk delete gunny purchases
 */
export const bulkDeleteGunnyPurchases = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${getGunnyEndpoint(millId)}/bulk`, {
        data: { ids },
    })
}
