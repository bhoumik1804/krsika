/**
 * Broker Report Service
 * API client for Broker CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    BrokerResponse,
    BrokerListResponse,
    BrokerSummaryResponse,
    CreateBrokerRequest,
    UpdateBrokerRequest,
    BrokerQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const BROKER_ENDPOINT = (millId: string) => `/mills/${millId}/brokers`

// ==========================================
// Broker API Functions
// ==========================================

/**
 * Fetch all brokers with pagination and filters
 */
export const fetchBrokerList = async (
    millId: string,
    params?: BrokerQueryParams
): Promise<BrokerListResponse> => {
    const response = await apiClient.get<ApiResponse<BrokerListResponse>>(
        BROKER_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single broker by ID
 */
export const fetchBrokerById = async (
    millId: string,
    id: string
): Promise<BrokerResponse> => {
    const response = await apiClient.get<ApiResponse<BrokerResponse>>(
        `${BROKER_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch broker summary/statistics
 */
export const fetchBrokerSummary = async (
    millId: string
): Promise<BrokerSummaryResponse> => {
    const response = await apiClient.get<ApiResponse<BrokerSummaryResponse>>(
        `${BROKER_ENDPOINT(millId)}/summary`
    )
    return response.data.data
}

/**
 * Create a new broker
 */
export const createBroker = async (
    millId: string,
    data: CreateBrokerRequest
): Promise<BrokerResponse> => {
    const response = await apiClient.post<ApiResponse<BrokerResponse>>(
        BROKER_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing broker
 */
export const updateBroker = async (
    millId: string,
    { id, ...data }: UpdateBrokerRequest
): Promise<BrokerResponse> => {
    const response = await apiClient.put<ApiResponse<BrokerResponse>>(
        `${BROKER_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a broker
 */
export const deleteBroker = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${BROKER_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete brokers
 */
export const bulkDeleteBroker = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${BROKER_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export brokers to CSV/Excel
 */
export const exportBroker = async (
    millId: string,
    params?: BrokerQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(`${BROKER_ENDPOINT(millId)}/export`, {
        params: { ...params, format },
        responseType: 'blob',
    })
    return response.data
}
