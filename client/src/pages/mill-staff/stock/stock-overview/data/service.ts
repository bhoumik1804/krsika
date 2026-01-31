/**
 * Stock Overview Service
 * API client for Stock Overview CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    StockOverviewResponse,
    StockOverviewListResponse,
    StockOverviewSummaryResponse,
    CreateStockOverviewRequest,
    UpdateStockOverviewRequest,
    StockOverviewQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const STOCK_OVERVIEW_ENDPOINT = (millId: string) =>
    `/mills/${millId}/stock-overview`

// ==========================================
// Stock Overview API Functions
// ==========================================

/**
 * Fetch all stock overview entries with pagination and filters
 */
export const fetchStockOverviewList = async (
    millId: string,
    params?: StockOverviewQueryParams
): Promise<StockOverviewListResponse> => {
    const response = await apiClient.get<
        ApiResponse<StockOverviewListResponse>
    >(STOCK_OVERVIEW_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single stock overview entry by ID
 */
export const fetchStockOverviewById = async (
    millId: string,
    id: string
): Promise<StockOverviewResponse> => {
    const response = await apiClient.get<ApiResponse<StockOverviewResponse>>(
        `${STOCK_OVERVIEW_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch stock overview summary/statistics
 */
export const fetchStockOverviewSummary = async (
    millId: string,
    params?: Pick<StockOverviewQueryParams, 'startDate' | 'endDate'>
): Promise<StockOverviewSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<StockOverviewSummaryResponse>
    >(`${STOCK_OVERVIEW_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new stock overview entry
 */
export const createStockOverview = async (
    millId: string,
    data: CreateStockOverviewRequest
): Promise<StockOverviewResponse> => {
    const response = await apiClient.post<ApiResponse<StockOverviewResponse>>(
        STOCK_OVERVIEW_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing stock overview entry
 */
export const updateStockOverview = async (
    millId: string,
    { id, ...data }: UpdateStockOverviewRequest
): Promise<StockOverviewResponse> => {
    const response = await apiClient.put<ApiResponse<StockOverviewResponse>>(
        `${STOCK_OVERVIEW_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a stock overview entry
 */
export const deleteStockOverview = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${STOCK_OVERVIEW_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete stock overview entries
 */
export const bulkDeleteStockOverview = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${STOCK_OVERVIEW_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export stock overview entries to CSV/Excel
 */
export const exportStockOverview = async (
    millId: string,
    params?: StockOverviewQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${STOCK_OVERVIEW_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
