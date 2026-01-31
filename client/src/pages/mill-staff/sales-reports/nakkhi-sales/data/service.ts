/**
 * Nakkhi Sales Service
 * API client for Nakkhi Sales CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    NakkhiSaleResponse,
    NakkhiSaleListResponse,
    NakkhiSaleSummaryResponse,
    CreateNakkhiSaleRequest,
    UpdateNakkhiSaleRequest,
    NakkhiSaleQueryParams,
    NakkhiSaleSummaryQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const NAKKHI_SALES_ENDPOINT = (millId: string) =>
    `/mills/${millId}/nakkhi-sales`

// ==========================================
// Nakkhi Sales CRUD API Functions
// ==========================================

/**
 * Fetch all nakkhi sales with pagination and filters
 */
export const fetchNakkhiSalesList = async (
    millId: string,
    params?: NakkhiSaleQueryParams
): Promise<NakkhiSaleListResponse> => {
    const response = await apiClient.get<ApiResponse<NakkhiSaleListResponse>>(
        NAKKHI_SALES_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single nakkhi sale by ID
 */
export const fetchNakkhiSaleById = async (
    millId: string,
    id: string
): Promise<NakkhiSaleResponse> => {
    const response = await apiClient.get<ApiResponse<NakkhiSaleResponse>>(
        `${NAKKHI_SALES_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch nakkhi sales summary/statistics
 */
export const fetchNakkhiSalesSummary = async (
    millId: string,
    params?: NakkhiSaleSummaryQueryParams
): Promise<NakkhiSaleSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<NakkhiSaleSummaryResponse>
    >(`${NAKKHI_SALES_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new nakkhi sale
 */
export const createNakkhiSale = async (
    millId: string,
    data: CreateNakkhiSaleRequest
): Promise<NakkhiSaleResponse> => {
    const response = await apiClient.post<ApiResponse<NakkhiSaleResponse>>(
        NAKKHI_SALES_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing nakkhi sale
 */
export const updateNakkhiSale = async (
    millId: string,
    { id, ...data }: UpdateNakkhiSaleRequest
): Promise<NakkhiSaleResponse> => {
    const response = await apiClient.put<ApiResponse<NakkhiSaleResponse>>(
        `${NAKKHI_SALES_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a nakkhi sale
 */
export const deleteNakkhiSale = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${NAKKHI_SALES_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete nakkhi sales
 */
export const bulkDeleteNakkhiSales = async (
    millId: string,
    ids: string[]
): Promise<{ deletedCount: number }> => {
    const response = await apiClient.delete<
        ApiResponse<{ deletedCount: number }>
    >(`${NAKKHI_SALES_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
    return response.data.data
}

/**
 * Export nakkhi sales data
 */
export const exportNakkhiSales = async (
    millId: string,
    params?: NakkhiSaleQueryParams
): Promise<Blob> => {
    const response = await apiClient.get(
        `${NAKKHI_SALES_ENDPOINT(millId)}/export`,
        {
            params,
            responseType: 'blob',
        }
    )
    return response.data
}
