/**
 * Balance Lifting Party Service
 * API client for Balance Lifting Party CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    BalanceLiftingPartyResponse,
    BalanceLiftingPartyListResponse,
    BalanceLiftingPartySummaryResponse,
    CreateBalanceLiftingPartyRequest,
    UpdateBalanceLiftingPartyRequest,
    BalanceLiftingPartyQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const BALANCE_LIFTING_PARTY_ENDPOINT = (millId: string) =>
    `/mills/${millId}/balance-lifting-party`

// ==========================================
// Balance Lifting Party API Functions
// ==========================================

/**
 * Fetch all balance lifting party entries with pagination and filters
 */
export const fetchBalanceLiftingPartyList = async (
    millId: string,
    params?: BalanceLiftingPartyQueryParams
): Promise<BalanceLiftingPartyListResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingPartyListResponse>
    >(BALANCE_LIFTING_PARTY_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single balance lifting party entry by ID
 */
export const fetchBalanceLiftingPartyById = async (
    millId: string,
    id: string
): Promise<BalanceLiftingPartyResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingPartyResponse>
    >(`${BALANCE_LIFTING_PARTY_ENDPOINT(millId)}/${id}`)
    return response.data.data
}

/**
 * Fetch balance lifting party summary/statistics
 */
export const fetchBalanceLiftingPartySummary = async (
    millId: string
): Promise<BalanceLiftingPartySummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<BalanceLiftingPartySummaryResponse>
    >(`${BALANCE_LIFTING_PARTY_ENDPOINT(millId)}/summary`)
    return response.data.data
}

/**
 * Create a new balance lifting party entry
 */
export const createBalanceLiftingParty = async (
    millId: string,
    data: CreateBalanceLiftingPartyRequest
): Promise<BalanceLiftingPartyResponse> => {
    const response = await apiClient.post<
        ApiResponse<BalanceLiftingPartyResponse>
    >(BALANCE_LIFTING_PARTY_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing balance lifting party entry
 */
export const updateBalanceLiftingParty = async (
    millId: string,
    { id, ...data }: UpdateBalanceLiftingPartyRequest
): Promise<BalanceLiftingPartyResponse> => {
    const response = await apiClient.put<
        ApiResponse<BalanceLiftingPartyResponse>
    >(`${BALANCE_LIFTING_PARTY_ENDPOINT(millId)}/${id}`, data)
    return response.data.data
}

/**
 * Delete a balance lifting party entry
 */
export const deleteBalanceLiftingParty = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${BALANCE_LIFTING_PARTY_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete balance lifting party entries
 */
export const bulkDeleteBalanceLiftingParty = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${BALANCE_LIFTING_PARTY_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export balance lifting party entries to CSV/Excel
 */
export const exportBalanceLiftingParty = async (
    millId: string,
    params?: BalanceLiftingPartyQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${BALANCE_LIFTING_PARTY_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
