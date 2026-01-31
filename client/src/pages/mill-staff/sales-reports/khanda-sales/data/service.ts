/**
 * Khanda Sales Service
 * API client for Khanda Sales CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    KhandaSaleResponse,
    KhandaSaleListResponse,
    KhandaSaleSummaryResponse,
    CreateKhandaSaleRequest,
    UpdateKhandaSaleRequest,
    KhandaSaleQueryParams,
    KhandaSaleSummaryQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const KHANDA_SALES_ENDPOINT = (millId: string) =>
    `/mills/${millId}/khanda-sales`

// ==========================================
// Khanda Sales CRUD API Functions
// ==========================================

/**
 * Fetch all khanda sales with pagination and filters
 */
export const fetchKhandaSalesList = async (
    millId: string,
    params?: KhandaSaleQueryParams
): Promise<KhandaSaleListResponse> => {
    const response = await apiClient.get<ApiResponse<KhandaSaleListResponse>>(
        KHANDA_SALES_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single khanda sale by ID
 */
export const fetchKhandaSaleById = async (
    millId: string,
    id: string
): Promise<KhandaSaleResponse> => {
    const response = await apiClient.get<ApiResponse<KhandaSaleResponse>>(
        `${KHANDA_SALES_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch khanda sales summary/statistics
 */
export const fetchKhandaSalesSummary = async (
    millId: string,
    params?: KhandaSaleSummaryQueryParams
): Promise<KhandaSaleSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<KhandaSaleSummaryResponse>
    >(`${KHANDA_SALES_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new khanda sale
 */
export const createKhandaSale = async (
    millId: string,
    data: CreateKhandaSaleRequest
): Promise<KhandaSaleResponse> => {
    const response = await apiClient.post<ApiResponse<KhandaSaleResponse>>(
        KHANDA_SALES_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing khanda sale
 */
export const updateKhandaSale = async (
    millId: string,
    { id, ...data }: UpdateKhandaSaleRequest
): Promise<KhandaSaleResponse> => {
    const response = await apiClient.put<ApiResponse<KhandaSaleResponse>>(
        `${KHANDA_SALES_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a khanda sale
 */
export const deleteKhandaSale = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${KHANDA_SALES_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete khanda sales
 */
export const bulkDeleteKhandaSales = async (
    millId: string,
    ids: string[]
): Promise<{ deletedCount: number }> => {
    const response = await apiClient.delete<
        ApiResponse<{ deletedCount: number }>
    >(`${KHANDA_SALES_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
    return response.data.data
}

/**
 * Export khanda sales data
 */
export const exportKhandaSales = async (
    millId: string,
    params?: KhandaSaleQueryParams
): Promise<Blob> => {
    const response = await apiClient.get(
        `${KHANDA_SALES_ENDPOINT(millId)}/export`,
        {
            params,
            responseType: 'blob',
        }
    )
    return response.data
}
