/**
 * Gunny Sales Service
 * API client for Gunny Sales CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    GunnySaleResponse,
    GunnySaleListResponse,
    GunnySaleSummaryResponse,
    CreateGunnySaleRequest,
    UpdateGunnySaleRequest,
    GunnySaleQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const GUNNY_SALES_ENDPOINT = (millId: string) => `/mills/${millId}/gunny-sales`

// ==========================================
// Gunny Sales API Functions
// ==========================================

/**
 * Fetch all gunny sales entries with pagination and filters
 */
export const fetchGunnySaleList = async (
    millId: string,
    params?: GunnySaleQueryParams
): Promise<GunnySaleListResponse> => {
    const response = await apiClient.get<ApiResponse<GunnySaleListResponse>>(
        GUNNY_SALES_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single gunny sale entry by ID
 */
export const fetchGunnySaleById = async (
    millId: string,
    id: string
): Promise<GunnySaleResponse> => {
    const response = await apiClient.get<ApiResponse<GunnySaleResponse>>(
        `${GUNNY_SALES_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch gunny sales summary/statistics
 */
export const fetchGunnySaleSummary = async (
    millId: string,
    params?: Pick<GunnySaleQueryParams, 'startDate' | 'endDate'>
): Promise<GunnySaleSummaryResponse> => {
    const response = await apiClient.get<ApiResponse<GunnySaleSummaryResponse>>(
        `${GUNNY_SALES_ENDPOINT(millId)}/summary`,
        { params }
    )
    return response.data.data
}

/**
 * Create a new gunny sale entry
 */
export const createGunnySale = async (
    millId: string,
    data: CreateGunnySaleRequest
): Promise<GunnySaleResponse> => {
    const response = await apiClient.post<ApiResponse<GunnySaleResponse>>(
        GUNNY_SALES_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing gunny sale entry
 */
export const updateGunnySale = async (
    millId: string,
    { id, ...data }: UpdateGunnySaleRequest
): Promise<GunnySaleResponse> => {
    const response = await apiClient.put<ApiResponse<GunnySaleResponse>>(
        `${GUNNY_SALES_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a gunny sale entry
 */
export const deleteGunnySale = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${GUNNY_SALES_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete gunny sale entries
 */
export const bulkDeleteGunnySale = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${GUNNY_SALES_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export gunny sale entries to CSV/Excel
 */
export const exportGunnySale = async (
    millId: string,
    params?: GunnySaleQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${GUNNY_SALES_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
