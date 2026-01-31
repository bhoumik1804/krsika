/**
 * Balance Lifting Purchases Paddy Service
 * API client for Balance Lifting Purchases Paddy CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    BalanceLiftingPurchasesPaddyResponse,
    BalanceLiftingPurchasesPaddyListResponse,
    BalanceLiftingPurchasesPaddySummaryResponse,
    CreateBalanceLiftingPurchasesPaddyRequest,
    UpdateBalanceLiftingPurchasesPaddyRequest,
    BalanceLiftingPurchasesPaddyQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const BALANCE_LIFTING_PURCHASES_PADDY_ENDPOINT = (millId: string) =>
    `/mills/${millId}/balance-lifting-purchases-paddy`

// ==========================================
// Balance Lifting Purchases Paddy API Functions
// ==========================================

/**
 * Fetch all balance lifting purchases paddy entries with pagination and filters
 */
export const fetchBalanceLiftingPurchasesPaddyList = async (
    millId: string,
    params?: BalanceLiftingPurchasesPaddyQueryParams
): Promise<BalanceLiftingPurchasesPaddyListResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingPurchasesPaddyListResponse>
    >(BALANCE_LIFTING_PURCHASES_PADDY_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single balance lifting purchases paddy entry by ID
 */
export const fetchBalanceLiftingPurchasesPaddyById = async (
    millId: string,
    id: string
): Promise<BalanceLiftingPurchasesPaddyResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingPurchasesPaddyResponse>
    >(`${BALANCE_LIFTING_PURCHASES_PADDY_ENDPOINT(millId)}/${id}`)
    return response.data.data
}

/**
 * Fetch balance lifting purchases paddy summary/statistics
 */
export const fetchBalanceLiftingPurchasesPaddySummary = async (
    millId: string,
    params?: Pick<
        BalanceLiftingPurchasesPaddyQueryParams,
        'startDate' | 'endDate'
    >
): Promise<BalanceLiftingPurchasesPaddySummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingPurchasesPaddySummaryResponse>
    >(`${BALANCE_LIFTING_PURCHASES_PADDY_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new balance lifting purchases paddy entry
 */
export const createBalanceLiftingPurchasesPaddy = async (
    millId: string,
    data: CreateBalanceLiftingPurchasesPaddyRequest
): Promise<BalanceLiftingPurchasesPaddyResponse> => {
    const response = await apiClient.post<
        ApiResponse<BalanceLiftingPurchasesPaddyResponse>
    >(BALANCE_LIFTING_PURCHASES_PADDY_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing balance lifting purchases paddy entry
 */
export const updateBalanceLiftingPurchasesPaddy = async (
    millId: string,
    { id, ...data }: UpdateBalanceLiftingPurchasesPaddyRequest
): Promise<BalanceLiftingPurchasesPaddyResponse> => {
    const response = await apiClient.put<
        ApiResponse<BalanceLiftingPurchasesPaddyResponse>
    >(`${BALANCE_LIFTING_PURCHASES_PADDY_ENDPOINT(millId)}/${id}`, data)
    return response.data.data
}

/**
 * Delete a balance lifting purchases paddy entry
 */
export const deleteBalanceLiftingPurchasesPaddy = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(
        `${BALANCE_LIFTING_PURCHASES_PADDY_ENDPOINT(millId)}/${id}`
    )
}

/**
 * Bulk delete balance lifting purchases paddy entries
 */
export const bulkDeleteBalanceLiftingPurchasesPaddy = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(
        `${BALANCE_LIFTING_PURCHASES_PADDY_ENDPOINT(millId)}/bulk`,
        {
            data: { ids },
        }
    )
}

/**
 * Export balance lifting purchases paddy entries to CSV/Excel
 */
export const exportBalanceLiftingPurchasesPaddy = async (
    millId: string,
    params?: BalanceLiftingPurchasesPaddyQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${BALANCE_LIFTING_PURCHASES_PADDY_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
