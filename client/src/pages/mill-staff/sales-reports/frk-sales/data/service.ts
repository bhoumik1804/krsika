/**
 * FRK Sales Service
 * API client for FRK Sales CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    FrkSaleResponse,
    FrkSaleListResponse,
    FrkSaleSummaryResponse,
    CreateFrkSaleRequest,
    UpdateFrkSaleRequest,
    FrkSaleQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const FRK_SALES_ENDPOINT = (millId: string) => `/mills/${millId}/frk-sales`

// ==========================================
// FRK Sales API Functions
// ==========================================

/**
 * Fetch all FRK sales entries with pagination and filters
 */
export const fetchFrkSaleList = async (
    millId: string,
    params?: FrkSaleQueryParams
): Promise<FrkSaleListResponse> => {
    const response = await apiClient.get<ApiResponse<FrkSaleListResponse>>(
        FRK_SALES_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single FRK sale entry by ID
 */
export const fetchFrkSaleById = async (
    millId: string,
    id: string
): Promise<FrkSaleResponse> => {
    const response = await apiClient.get<ApiResponse<FrkSaleResponse>>(
        `${FRK_SALES_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch FRK sales summary/statistics
 */
export const fetchFrkSaleSummary = async (
    millId: string,
    params?: Pick<FrkSaleQueryParams, 'startDate' | 'endDate'>
): Promise<FrkSaleSummaryResponse> => {
    const response = await apiClient.get<ApiResponse<FrkSaleSummaryResponse>>(
        `${FRK_SALES_ENDPOINT(millId)}/summary`,
        { params }
    )
    return response.data.data
}

/**
 * Create a new FRK sale entry
 */
export const createFrkSale = async (
    millId: string,
    data: CreateFrkSaleRequest
): Promise<FrkSaleResponse> => {
    const response = await apiClient.post<ApiResponse<FrkSaleResponse>>(
        FRK_SALES_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing FRK sale entry
 */
export const updateFrkSale = async (
    millId: string,
    { id, ...data }: UpdateFrkSaleRequest
): Promise<FrkSaleResponse> => {
    const response = await apiClient.put<ApiResponse<FrkSaleResponse>>(
        `${FRK_SALES_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a FRK sale entry
 */
export const deleteFrkSale = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${FRK_SALES_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete FRK sale entries
 */
export const bulkDeleteFrkSale = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${FRK_SALES_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export FRK sale entries to CSV/Excel
 */
export const exportFrkSale = async (
    millId: string,
    params?: FrkSaleQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${FRK_SALES_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
