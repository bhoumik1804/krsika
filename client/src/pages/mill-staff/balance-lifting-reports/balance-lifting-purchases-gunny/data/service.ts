/**
 * Balance Lifting Purchases Gunny Service
 * API client for Balance Lifting Purchases Gunny CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    BalanceLiftingPurchasesGunnyResponse,
    BalanceLiftingPurchasesGunnyListResponse,
    BalanceLiftingPurchasesGunnySummaryResponse,
    CreateBalanceLiftingPurchasesGunnyRequest,
    UpdateBalanceLiftingPurchasesGunnyRequest,
    BalanceLiftingPurchasesGunnyQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const BALANCE_LIFTING_PURCHASES_GUNNY_ENDPOINT = (millId: string) =>
    `/mills/${millId}/balance-lifting-purchases-gunny`

// ==========================================
// Balance Lifting Purchases Gunny API Functions
// ==========================================

/**
 * Fetch all balance lifting purchases gunny entries with pagination and filters
 */
export const fetchBalanceLiftingPurchasesGunnyList = async (
    millId: string,
    params?: BalanceLiftingPurchasesGunnyQueryParams
): Promise<BalanceLiftingPurchasesGunnyListResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingPurchasesGunnyListResponse>
    >(BALANCE_LIFTING_PURCHASES_GUNNY_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single balance lifting purchases gunny entry by ID
 */
export const fetchBalanceLiftingPurchasesGunnyById = async (
    millId: string,
    id: string
): Promise<BalanceLiftingPurchasesGunnyResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingPurchasesGunnyResponse>
    >(`${BALANCE_LIFTING_PURCHASES_GUNNY_ENDPOINT(millId)}/${id}`)
    return response.data.data
}

/**
 * Fetch balance lifting purchases gunny summary/statistics
 */
export const fetchBalanceLiftingPurchasesGunnySummary = async (
    millId: string,
    params?: Pick<
        BalanceLiftingPurchasesGunnyQueryParams,
        'startDate' | 'endDate'
    >
): Promise<BalanceLiftingPurchasesGunnySummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingPurchasesGunnySummaryResponse>
    >(`${BALANCE_LIFTING_PURCHASES_GUNNY_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new balance lifting purchases gunny entry
 */
export const createBalanceLiftingPurchasesGunny = async (
    millId: string,
    data: CreateBalanceLiftingPurchasesGunnyRequest
): Promise<BalanceLiftingPurchasesGunnyResponse> => {
    const response = await apiClient.post<
        ApiResponse<BalanceLiftingPurchasesGunnyResponse>
    >(BALANCE_LIFTING_PURCHASES_GUNNY_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing balance lifting purchases gunny entry
 */
export const updateBalanceLiftingPurchasesGunny = async (
    millId: string,
    { id, ...data }: UpdateBalanceLiftingPurchasesGunnyRequest
): Promise<BalanceLiftingPurchasesGunnyResponse> => {
    const response = await apiClient.put<
        ApiResponse<BalanceLiftingPurchasesGunnyResponse>
    >(`${BALANCE_LIFTING_PURCHASES_GUNNY_ENDPOINT(millId)}/${id}`, data)
    return response.data.data
}

/**
 * Delete a balance lifting purchases gunny entry
 */
export const deleteBalanceLiftingPurchasesGunny = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(
        `${BALANCE_LIFTING_PURCHASES_GUNNY_ENDPOINT(millId)}/${id}`
    )
}

/**
 * Bulk delete balance lifting purchases gunny entries
 */
export const bulkDeleteBalanceLiftingPurchasesGunny = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(
        `${BALANCE_LIFTING_PURCHASES_GUNNY_ENDPOINT(millId)}/bulk`,
        {
            data: { ids },
        }
    )
}

/**
 * Export balance lifting purchases gunny entries to CSV/Excel
 */
export const exportBalanceLiftingPurchasesGunny = async (
    millId: string,
    params?: BalanceLiftingPurchasesGunnyQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${BALANCE_LIFTING_PURCHASES_GUNNY_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
