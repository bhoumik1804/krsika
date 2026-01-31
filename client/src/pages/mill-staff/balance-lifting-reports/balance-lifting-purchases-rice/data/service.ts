/**
 * Balance Lifting Purchases Rice Service
 * API client for Balance Lifting Purchases Rice CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    BalanceLiftingPurchasesRiceResponse,
    BalanceLiftingPurchasesRiceListResponse,
    BalanceLiftingPurchasesRiceSummaryResponse,
    CreateBalanceLiftingPurchasesRiceRequest,
    UpdateBalanceLiftingPurchasesRiceRequest,
    BalanceLiftingPurchasesRiceQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const BALANCE_LIFTING_PURCHASES_RICE_ENDPOINT = (millId: string) =>
    `/mills/${millId}/balance-lifting-purchases-rice`

// ==========================================
// Balance Lifting Purchases Rice API Functions
// ==========================================

/**
 * Fetch all balance lifting purchases rice entries with pagination and filters
 */
export const fetchBalanceLiftingPurchasesRiceList = async (
    millId: string,
    params?: BalanceLiftingPurchasesRiceQueryParams
): Promise<BalanceLiftingPurchasesRiceListResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingPurchasesRiceListResponse>
    >(BALANCE_LIFTING_PURCHASES_RICE_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single balance lifting purchases rice entry by ID
 */
export const fetchBalanceLiftingPurchasesRiceById = async (
    millId: string,
    id: string
): Promise<BalanceLiftingPurchasesRiceResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingPurchasesRiceResponse>
    >(`${BALANCE_LIFTING_PURCHASES_RICE_ENDPOINT(millId)}/${id}`)
    return response.data.data
}

/**
 * Fetch balance lifting purchases rice summary/statistics
 */
export const fetchBalanceLiftingPurchasesRiceSummary = async (
    millId: string,
    params?: Pick<
        BalanceLiftingPurchasesRiceQueryParams,
        'startDate' | 'endDate'
    >
): Promise<BalanceLiftingPurchasesRiceSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingPurchasesRiceSummaryResponse>
    >(`${BALANCE_LIFTING_PURCHASES_RICE_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new balance lifting purchases rice entry
 */
export const createBalanceLiftingPurchasesRice = async (
    millId: string,
    data: CreateBalanceLiftingPurchasesRiceRequest
): Promise<BalanceLiftingPurchasesRiceResponse> => {
    const response = await apiClient.post<
        ApiResponse<BalanceLiftingPurchasesRiceResponse>
    >(BALANCE_LIFTING_PURCHASES_RICE_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing balance lifting purchases rice entry
 */
export const updateBalanceLiftingPurchasesRice = async (
    millId: string,
    { id, ...data }: UpdateBalanceLiftingPurchasesRiceRequest
): Promise<BalanceLiftingPurchasesRiceResponse> => {
    const response = await apiClient.put<
        ApiResponse<BalanceLiftingPurchasesRiceResponse>
    >(`${BALANCE_LIFTING_PURCHASES_RICE_ENDPOINT(millId)}/${id}`, data)
    return response.data.data
}

/**
 * Delete a balance lifting purchases rice entry
 */
export const deleteBalanceLiftingPurchasesRice = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(
        `${BALANCE_LIFTING_PURCHASES_RICE_ENDPOINT(millId)}/${id}`
    )
}

/**
 * Bulk delete balance lifting purchases rice entries
 */
export const bulkDeleteBalanceLiftingPurchasesRice = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(
        `${BALANCE_LIFTING_PURCHASES_RICE_ENDPOINT(millId)}/bulk`,
        {
            data: { ids },
        }
    )
}

/**
 * Export balance lifting purchases rice entries to CSV/Excel
 */
export const exportBalanceLiftingPurchasesRice = async (
    millId: string,
    params?: BalanceLiftingPurchasesRiceQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${BALANCE_LIFTING_PURCHASES_RICE_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
