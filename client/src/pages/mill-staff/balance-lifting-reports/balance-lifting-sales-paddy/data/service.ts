/**
 * Balance Lifting Sales Paddy Service
 * API client for Balance Lifting Sales Paddy CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    BalanceLiftingSalesPaddyResponse,
    BalanceLiftingSalesPaddyListResponse,
    BalanceLiftingSalesPaddySummaryResponse,
    CreateBalanceLiftingSalesPaddyRequest,
    UpdateBalanceLiftingSalesPaddyRequest,
    BalanceLiftingSalesPaddyQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const BALANCE_LIFTING_SALES_PADDY_ENDPOINT = (millId: string) =>
    `/mills/${millId}/balance-lifting-sales-paddy`

// ==========================================
// Balance Lifting Sales Paddy API Functions
// ==========================================

/**
 * Fetch all balance lifting sales paddy entries with pagination and filters
 */
export const fetchBalanceLiftingSalesPaddyList = async (
    millId: string,
    params?: BalanceLiftingSalesPaddyQueryParams
): Promise<BalanceLiftingSalesPaddyListResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingSalesPaddyListResponse>
    >(BALANCE_LIFTING_SALES_PADDY_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single balance lifting sales paddy entry by ID
 */
export const fetchBalanceLiftingSalesPaddyById = async (
    millId: string,
    id: string
): Promise<BalanceLiftingSalesPaddyResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingSalesPaddyResponse>
    >(`${BALANCE_LIFTING_SALES_PADDY_ENDPOINT(millId)}/${id}`)
    return response.data.data
}

/**
 * Fetch balance lifting sales paddy summary/statistics
 */
export const fetchBalanceLiftingSalesPaddySummary = async (
    millId: string,
    params?: Pick<BalanceLiftingSalesPaddyQueryParams, 'startDate' | 'endDate'>
): Promise<BalanceLiftingSalesPaddySummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingSalesPaddySummaryResponse>
    >(`${BALANCE_LIFTING_SALES_PADDY_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new balance lifting sales paddy entry
 */
export const createBalanceLiftingSalesPaddy = async (
    millId: string,
    data: CreateBalanceLiftingSalesPaddyRequest
): Promise<BalanceLiftingSalesPaddyResponse> => {
    const response = await apiClient.post<
        ApiResponse<BalanceLiftingSalesPaddyResponse>
    >(BALANCE_LIFTING_SALES_PADDY_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing balance lifting sales paddy entry
 */
export const updateBalanceLiftingSalesPaddy = async (
    millId: string,
    { id, ...data }: UpdateBalanceLiftingSalesPaddyRequest
): Promise<BalanceLiftingSalesPaddyResponse> => {
    const response = await apiClient.put<
        ApiResponse<BalanceLiftingSalesPaddyResponse>
    >(`${BALANCE_LIFTING_SALES_PADDY_ENDPOINT(millId)}/${id}`, data)
    return response.data.data
}

/**
 * Delete a balance lifting sales paddy entry
 */
export const deleteBalanceLiftingSalesPaddy = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(
        `${BALANCE_LIFTING_SALES_PADDY_ENDPOINT(millId)}/${id}`
    )
}

/**
 * Bulk delete balance lifting sales paddy entries
 */
export const bulkDeleteBalanceLiftingSalesPaddy = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(
        `${BALANCE_LIFTING_SALES_PADDY_ENDPOINT(millId)}/bulk`,
        {
            data: { ids },
        }
    )
}

/**
 * Export balance lifting sales paddy entries to CSV/Excel
 */
export const exportBalanceLiftingSalesPaddy = async (
    millId: string,
    params?: BalanceLiftingSalesPaddyQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${BALANCE_LIFTING_SALES_PADDY_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
