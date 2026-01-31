/**
 * Party Transaction Service
 * API client for Party Transaction CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    PartyTransactionResponse,
    PartyTransactionListResponse,
    PartyTransactionSummaryResponse,
    CreatePartyTransactionRequest,
    UpdatePartyTransactionRequest,
    PartyTransactionQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const PARTY_TRANSACTION_ENDPOINT = (millId: string) =>
    `/mills/${millId}/party-transactions`

// ==========================================
// Party Transaction API Functions
// ==========================================

/**
 * Fetch all party transaction entries with pagination and filters
 */
export const fetchPartyTransactionList = async (
    millId: string,
    params?: PartyTransactionQueryParams
): Promise<PartyTransactionListResponse> => {
    const response = await apiClient.get<
        ApiResponse<PartyTransactionListResponse>
    >(PARTY_TRANSACTION_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single party transaction entry by ID
 */
export const fetchPartyTransactionById = async (
    millId: string,
    id: string
): Promise<PartyTransactionResponse> => {
    const response = await apiClient.get<ApiResponse<PartyTransactionResponse>>(
        `${PARTY_TRANSACTION_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch party transaction summary/statistics
 */
export const fetchPartyTransactionSummary = async (
    millId: string,
    params?: Pick<
        PartyTransactionQueryParams,
        'startDate' | 'endDate' | 'partyName'
    >
): Promise<PartyTransactionSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<PartyTransactionSummaryResponse>
    >(`${PARTY_TRANSACTION_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new party transaction entry
 */
export const createPartyTransaction = async (
    millId: string,
    data: CreatePartyTransactionRequest
): Promise<PartyTransactionResponse> => {
    const response = await apiClient.post<
        ApiResponse<PartyTransactionResponse>
    >(PARTY_TRANSACTION_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing party transaction entry
 */
export const updatePartyTransaction = async (
    millId: string,
    { id, ...data }: UpdatePartyTransactionRequest
): Promise<PartyTransactionResponse> => {
    const response = await apiClient.put<ApiResponse<PartyTransactionResponse>>(
        `${PARTY_TRANSACTION_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a party transaction entry
 */
export const deletePartyTransaction = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${PARTY_TRANSACTION_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete party transaction entries
 */
export const bulkDeletePartyTransaction = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${PARTY_TRANSACTION_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export party transaction entries to CSV/Excel
 */
export const exportPartyTransaction = async (
    millId: string,
    params?: PartyTransactionQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${PARTY_TRANSACTION_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
