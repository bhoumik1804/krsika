/**
 * Rice Sales Service
 * API client for Rice Sales CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    RiceSaleResponse,
    RiceSaleListResponse,
    RiceSaleSummaryResponse,
    CreateRiceSaleRequest,
    UpdateRiceSaleRequest,
    RiceSaleQueryParams,
    RiceSaleSummaryQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const RICE_SALES_ENDPOINT = (millId: string) => `/mills/${millId}/rice-sales`

// ==========================================
// Rice Sales CRUD API Functions
// ==========================================

/**
 * Fetch all rice sales with pagination and filters
 */
export const fetchRiceSalesList = async (
    millId: string,
    params?: RiceSaleQueryParams
): Promise<RiceSaleListResponse> => {
    const response = await apiClient.get<ApiResponse<RiceSaleListResponse>>(
        RICE_SALES_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single rice sale by ID
 */
export const fetchRiceSaleById = async (
    millId: string,
    id: string
): Promise<RiceSaleResponse> => {
    const response = await apiClient.get<ApiResponse<RiceSaleResponse>>(
        `${RICE_SALES_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch rice sales summary/statistics
 */
export const fetchRiceSalesSummary = async (
    millId: string,
    params?: RiceSaleSummaryQueryParams
): Promise<RiceSaleSummaryResponse> => {
    const response = await apiClient.get<ApiResponse<RiceSaleSummaryResponse>>(
        `${RICE_SALES_ENDPOINT(millId)}/summary`,
        { params }
    )
    return response.data.data
}

/**
 * Create a new rice sale
 */
export const createRiceSale = async (
    millId: string,
    data: CreateRiceSaleRequest
): Promise<RiceSaleResponse> => {
    const response = await apiClient.post<ApiResponse<RiceSaleResponse>>(
        RICE_SALES_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing rice sale
 */
export const updateRiceSale = async (
    millId: string,
    { id, ...data }: UpdateRiceSaleRequest
): Promise<RiceSaleResponse> => {
    const response = await apiClient.put<ApiResponse<RiceSaleResponse>>(
        `${RICE_SALES_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a rice sale
 */
export const deleteRiceSale = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${RICE_SALES_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete rice sales
 */
export const bulkDeleteRiceSales = async (
    millId: string,
    ids: string[]
): Promise<{ deletedCount: number }> => {
    const response = await apiClient.delete<
        ApiResponse<{ deletedCount: number }>
    >(`${RICE_SALES_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
    return response.data.data
}

/**
 * Export rice sales data
 */
export const exportRiceSales = async (
    millId: string,
    params?: RiceSaleQueryParams
): Promise<Blob> => {
    const response = await apiClient.get(
        `${RICE_SALES_ENDPOINT(millId)}/export`,
        {
            params,
            responseType: 'blob',
        }
    )
    return response.data
}
