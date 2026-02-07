/**
 * Party Report Service
 * API client for Party Report operations (Mill Admin)
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type { PartyReportData } from './schema'

// ==========================================
// Types
// ==========================================

export interface PartyListResponse {
    parties: PartyReportData[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

export interface PartyQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// API Functions
// ==========================================

/**
 * Fetch parties list for a specific mill with pagination and filters
 */
export const fetchPartyList = async (
    millId: string,
    params?: PartyQueryParams
): Promise<PartyListResponse> => {
    const response = await apiClient.get<
        ApiResponse<{ parties: PartyReportData[]; pagination: any }>
    >(`/mills/${millId}/parties`, { params })
    return response.data.data
}

/**
 * Create a new party
 */
export const createParty = async (
    millId: string,
    data: Partial<PartyReportData>
): Promise<PartyReportData> => {
    const response = await apiClient.post<
        ApiResponse<{ party: PartyReportData }>
    >(`/mills/${millId}/parties`, data)
    return response.data.data.party
}

/**
 * Update a party
 */
export const updateParty = async (
    millId: string,
    partyId: string,
    data: Partial<PartyReportData>
): Promise<PartyReportData> => {
    const response = await apiClient.put<
        ApiResponse<{ party: PartyReportData }>
    >(`/mills/${millId}/parties/${partyId}`, data)
    return response.data.data.party
}

/**
 * Delete a party
 */
export const deleteParty = async (
    millId: string,
    partyId: string
): Promise<void> => {
    await apiClient.delete(`/mills/${millId}/parties/${partyId}`)
}

/**
 * Bulk delete parties
 */
export const bulkDeleteParties = async (
    millId: string,
    partyIds: string[]
): Promise<void> => {
    await apiClient.post(`/mills/${millId}/parties/bulk-delete`, {
        ids: partyIds,
    })
}
