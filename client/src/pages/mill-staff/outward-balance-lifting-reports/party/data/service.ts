/**
 * Outward Balance Lifting Party Service
 * API client for Outward Balance Lifting Party CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    OutwardBalancePartyResponse,
    OutwardBalancePartyListResponse,
    OutwardBalancePartySummaryResponse,
    CreateOutwardBalancePartyRequest,
    UpdateOutwardBalancePartyRequest,
    OutwardBalancePartyQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const OUTWARD_BALANCE_PARTY_ENDPOINT = (millId: string) =>
    `/mills/${millId}/outward-balance-party`

// ==========================================
// Outward Balance Lifting Party API Functions
// ==========================================

/**
 * Fetch all outward balance party entries with pagination and filters
 */
export const fetchOutwardBalancePartyList = async (
    millId: string,
    params?: OutwardBalancePartyQueryParams
): Promise<OutwardBalancePartyListResponse> => {
    const response = await apiClient.get<
        ApiResponse<OutwardBalancePartyListResponse>
    >(OUTWARD_BALANCE_PARTY_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single outward balance party entry by ID
 */
export const fetchOutwardBalancePartyById = async (
    millId: string,
    id: string
): Promise<OutwardBalancePartyResponse> => {
    const response = await apiClient.get<
        ApiResponse<OutwardBalancePartyResponse>
    >(`${OUTWARD_BALANCE_PARTY_ENDPOINT(millId)}/${id}`)
    return response.data.data
}

/**
 * Fetch outward balance party summary/statistics
 */
export const fetchOutwardBalancePartySummary = async (
    millId: string
): Promise<OutwardBalancePartySummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<OutwardBalancePartySummaryResponse>
    >(`${OUTWARD_BALANCE_PARTY_ENDPOINT(millId)}/summary`)
    return response.data.data
}

/**
 * Create a new outward balance party entry
 */
export const createOutwardBalanceParty = async (
    millId: string,
    data: CreateOutwardBalancePartyRequest
): Promise<OutwardBalancePartyResponse> => {
    const response = await apiClient.post<
        ApiResponse<OutwardBalancePartyResponse>
    >(OUTWARD_BALANCE_PARTY_ENDPOINT(millId), data)
    return response.data.data
}

/**
 * Update an existing outward balance party entry
 */
export const updateOutwardBalanceParty = async (
    millId: string,
    { id, ...data }: UpdateOutwardBalancePartyRequest
): Promise<OutwardBalancePartyResponse> => {
    const response = await apiClient.put<
        ApiResponse<OutwardBalancePartyResponse>
    >(`${OUTWARD_BALANCE_PARTY_ENDPOINT(millId)}/${id}`, data)
    return response.data.data
}

/**
 * Delete an outward balance party entry
 */
export const deleteOutwardBalanceParty = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${OUTWARD_BALANCE_PARTY_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete outward balance party entries
 */
export const bulkDeleteOutwardBalanceParty = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${OUTWARD_BALANCE_PARTY_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export outward balance party entries to CSV/Excel
 */
export const exportOutwardBalanceParty = async (
    millId: string,
    params?: OutwardBalancePartyQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${OUTWARD_BALANCE_PARTY_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
