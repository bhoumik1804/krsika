/**
 * Broker Transaction Service
 * API client for Broker Transaction CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    BrokerTransactionResponse,
    BrokerTransactionListResponse,
    BrokerTransactionSummaryResponse,
    CreateBrokerTransactionRequest,
    UpdateBrokerTransactionRequest,
    BrokerTransactionQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const BROKER_TRANSACTION_ENDPOINT = (millId: string) =>
    `/mills/${millId}/broker-transactions`

// ==========================================
// Broker Transaction API Functions
// ==========================================

/**
 * Fetch all broker transaction entries with pagination and filters
 */
export const fetchBrokerTransactionList = async (
    millId: string,
    params?: BrokerTransactionQueryParams
): Promise<BrokerTransactionListResponse> => {
    const response = await apiClient.get<
        ApiResponse<BrokerTransactionListResponse>
    >(BROKER_TRANSACTION_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single broker transaction entry by ID
 */
export const fetchBrokerTransactionById = async (
    millId: string,
    id: string
): Promise<BrokerTransactionResponse> => {
    const response = await apiClient.get<
        ApiResponse<BrokerTransactionResponse>
    >(`${BROKER_TRANSACTION_ENDPOINT(millId)}/${id}`)
    return response.data.data
}

/**
 * Fetch broker transaction summary/statistics
 */
export const fetchBrokerTransactionSummary = async (
    millId: string,
    params?: Pick<
        BrokerTransactionQueryParams,
        'startDate' | 'endDate' | 'brokerName'
    >
): Promise<BrokerTransactionSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<BrokerTransactionSummaryResponse>
    >(`${BROKER_TRANSACTION_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new broker transaction entry
 */
export const createBrokerTransaction = async (
    millId: string,
    data: CreateBrokerTransactionRequest
): Promise<BrokerTransactionResponse> => {
    const response = await apiClient.post<
        ApiResponse<BrokerTransactionResponse>
    >(BROKER_TRANSACTION_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing broker transaction entry
 */
export const updateBrokerTransaction = async (
    millId: string,
    { id, ...data }: UpdateBrokerTransactionRequest
): Promise<BrokerTransactionResponse> => {
    const response = await apiClient.put<
        ApiResponse<BrokerTransactionResponse>
    >(`${BROKER_TRANSACTION_ENDPOINT(millId)}/${id}`, data)
    return response.data.data
}

/**
 * Delete a broker transaction entry
 */
export const deleteBrokerTransaction = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${BROKER_TRANSACTION_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete broker transaction entries
 */
export const bulkDeleteBrokerTransaction = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${BROKER_TRANSACTION_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export broker transaction entries to CSV/Excel
 */
export const exportBrokerTransaction = async (
    millId: string,
    params?: BrokerTransactionQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${BROKER_TRANSACTION_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
