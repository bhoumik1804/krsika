/**
 * Balance Lifting Purchases FRK Service
 * API client for Balance Lifting Purchases FRK CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    BalanceLiftingPurchasesFrkResponse,
    BalanceLiftingPurchasesFrkListResponse,
    BalanceLiftingPurchasesFrkSummaryResponse,
    CreateBalanceLiftingPurchasesFrkRequest,
    UpdateBalanceLiftingPurchasesFrkRequest,
    BalanceLiftingPurchasesFrkQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const BALANCE_LIFTING_PURCHASES_FRK_ENDPOINT = (millId: string) =>
    `/mills/${millId}/balance-lifting-purchases-frk`

// ==========================================
// Balance Lifting Purchases FRK API Functions
// ==========================================

/**
 * Fetch all balance lifting purchases FRK entries with pagination and filters
 */
export const fetchBalanceLiftingPurchasesFrkList = async (
    millId: string,
    params?: BalanceLiftingPurchasesFrkQueryParams
): Promise<BalanceLiftingPurchasesFrkListResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingPurchasesFrkListResponse>
    >(BALANCE_LIFTING_PURCHASES_FRK_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single balance lifting purchases FRK entry by ID
 */
export const fetchBalanceLiftingPurchasesFrkById = async (
    millId: string,
    id: string
): Promise<BalanceLiftingPurchasesFrkResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingPurchasesFrkResponse>
    >(`${BALANCE_LIFTING_PURCHASES_FRK_ENDPOINT(millId)}/${id}`)
    return response.data.data
}

/**
 * Fetch balance lifting purchases FRK summary/statistics
 */
export const fetchBalanceLiftingPurchasesFrkSummary = async (
    millId: string,
    params?: Pick<
        BalanceLiftingPurchasesFrkQueryParams,
        'startDate' | 'endDate'
    >
): Promise<BalanceLiftingPurchasesFrkSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingPurchasesFrkSummaryResponse>
    >(`${BALANCE_LIFTING_PURCHASES_FRK_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new balance lifting purchases FRK entry
 */
export const createBalanceLiftingPurchasesFrk = async (
    millId: string,
    data: CreateBalanceLiftingPurchasesFrkRequest
): Promise<BalanceLiftingPurchasesFrkResponse> => {
    const response = await apiClient.post<
        ApiResponse<BalanceLiftingPurchasesFrkResponse>
    >(BALANCE_LIFTING_PURCHASES_FRK_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing balance lifting purchases FRK entry
 */
export const updateBalanceLiftingPurchasesFrk = async (
    millId: string,
    { id, ...data }: UpdateBalanceLiftingPurchasesFrkRequest
): Promise<BalanceLiftingPurchasesFrkResponse> => {
    const response = await apiClient.put<
        ApiResponse<BalanceLiftingPurchasesFrkResponse>
    >(`${BALANCE_LIFTING_PURCHASES_FRK_ENDPOINT(millId)}/${id}`, data)
    return response.data.data
}

/**
 * Delete a balance lifting purchases FRK entry
 */
export const deleteBalanceLiftingPurchasesFrk = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(
        `${BALANCE_LIFTING_PURCHASES_FRK_ENDPOINT(millId)}/${id}`
    )
}

/**
 * Bulk delete balance lifting purchases FRK entries
 */
export const bulkDeleteBalanceLiftingPurchasesFrk = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(
        `${BALANCE_LIFTING_PURCHASES_FRK_ENDPOINT(millId)}/bulk`,
        {
            data: { ids },
        }
    )
}

/**
 * Export balance lifting purchases FRK entries to CSV/Excel
 */
export const exportBalanceLiftingPurchasesFrk = async (
    millId: string,
    params?: BalanceLiftingPurchasesFrkQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${BALANCE_LIFTING_PURCHASES_FRK_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
