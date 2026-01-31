/**
 * Other Sales Service
 * API client for Other Sales CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    OtherSaleResponse,
    OtherSaleListResponse,
    OtherSaleSummaryResponse,
    CreateOtherSaleRequest,
    UpdateOtherSaleRequest,
    OtherSaleQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const OTHER_SALES_ENDPOINT = (millId: string) => `/mills/${millId}/other-sales`

// ==========================================
// Other Sales API Functions
// ==========================================

/**
 * Fetch all other sales entries with pagination and filters
 */
export const fetchOtherSaleList = async (
    millId: string,
    params?: OtherSaleQueryParams
): Promise<OtherSaleListResponse> => {
    const response = await apiClient.get<ApiResponse<OtherSaleListResponse>>(
        OTHER_SALES_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single other sale entry by ID
 */
export const fetchOtherSaleById = async (
    millId: string,
    id: string
): Promise<OtherSaleResponse> => {
    const response = await apiClient.get<ApiResponse<OtherSaleResponse>>(
        `${OTHER_SALES_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch other sales summary/statistics
 */
export const fetchOtherSaleSummary = async (
    millId: string,
    params?: Pick<OtherSaleQueryParams, 'startDate' | 'endDate'>
): Promise<OtherSaleSummaryResponse> => {
    const response = await apiClient.get<ApiResponse<OtherSaleSummaryResponse>>(
        `${OTHER_SALES_ENDPOINT(millId)}/summary`,
        { params }
    )
    return response.data.data
}

/**
 * Create a new other sale entry
 */
export const createOtherSale = async (
    millId: string,
    data: CreateOtherSaleRequest
): Promise<OtherSaleResponse> => {
    const response = await apiClient.post<ApiResponse<OtherSaleResponse>>(
        OTHER_SALES_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing other sale entry
 */
export const updateOtherSale = async (
    millId: string,
    { id, ...data }: UpdateOtherSaleRequest
): Promise<OtherSaleResponse> => {
    const response = await apiClient.put<ApiResponse<OtherSaleResponse>>(
        `${OTHER_SALES_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete an other sale entry
 */
export const deleteOtherSale = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${OTHER_SALES_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete other sale entries
 */
export const bulkDeleteOtherSale = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${OTHER_SALES_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export other sale entries to CSV/Excel
 */
export const exportOtherSale = async (
    millId: string,
    params?: OtherSaleQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${OTHER_SALES_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
