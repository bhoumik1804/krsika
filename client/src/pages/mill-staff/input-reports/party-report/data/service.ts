/**
 * Party Report Service
 * API client for Party CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    PartyResponse,
    PartyListResponse,
    PartySummaryResponse,
    CreatePartyRequest,
    UpdatePartyRequest,
    PartyQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const PARTY_ENDPOINT = (millId: string) => `/mills/${millId}/parties`

// ==========================================
// Party API Functions
// ==========================================

/**
 * Fetch all parties with pagination and filters
 */
export const fetchPartyList = async (
    millId: string,
    params?: PartyQueryParams
): Promise<PartyListResponse> => {
    const response = await apiClient.get<ApiResponse<PartyListResponse>>(
        PARTY_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single party by ID
 */
export const fetchPartyById = async (
    millId: string,
    id: string
): Promise<PartyResponse> => {
    const response = await apiClient.get<ApiResponse<PartyResponse>>(
        `${PARTY_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch party summary/statistics
 */
export const fetchPartySummary = async (
    millId: string
): Promise<PartySummaryResponse> => {
    const response = await apiClient.get<ApiResponse<PartySummaryResponse>>(
        `${PARTY_ENDPOINT(millId)}/summary`
    )
    return response.data.data
}

/**
 * Create a new party
 */
export const createParty = async (
    millId: string,
    data: CreatePartyRequest
): Promise<PartyResponse> => {
    const response = await apiClient.post<ApiResponse<PartyResponse>>(
        PARTY_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing party
 */
export const updateParty = async (
    millId: string,
    { id, ...data }: UpdatePartyRequest
): Promise<PartyResponse> => {
    const response = await apiClient.put<ApiResponse<PartyResponse>>(
        `${PARTY_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a party
 */
export const deleteParty = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${PARTY_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete parties
 */
export const bulkDeleteParty = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${PARTY_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export parties to CSV/Excel
 */
export const exportParty = async (
    millId: string,
    params?: PartyQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(`${PARTY_ENDPOINT(millId)}/export`, {
        params: { ...params, format },
        responseType: 'blob',
    })
    return response.data
}
