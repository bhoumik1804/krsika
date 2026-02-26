import apiClient, { type ApiResponse } from '@/lib/api-client'
import type { PartyReportData } from './schema'

// ==========================================
// Types
// ==========================================

interface FetchPartyListParams {
    millId: string
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface PartyListResponse {
    parties: PartyReportData[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasPrevPage: boolean
        hasNextPage: boolean
        prevPage: number | null
        nextPage: number | null
    }
}

// ==========================================
// API Functions
// ==========================================

export const partyService = {
    fetchPartyList: async (
        params: FetchPartyListParams
    ): Promise<PartyListResponse> => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.limit) queryParams.append('limit', params.limit.toString())
        if (params.search) queryParams.append('search', params.search)
        if (params.sortBy) queryParams.append('sortBy', params.sortBy)
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

        const response = await apiClient.get<ApiResponse<PartyListResponse>>(
            `/mills/${params.millId}/parties?${queryParams.toString()}`
        )
        return response.data.data
    },

    createParty: async (
        millId: string,
        data: Partial<PartyReportData>
    ): Promise<PartyReportData> => {
        const response = await apiClient.post<
            ApiResponse<{ party: PartyReportData }>
        >(`/mills/${millId}/parties`, data)
        return response.data.data.party
    },

    updateParty: async (
        millId: string,
        partyId: string,
        data: Partial<PartyReportData>
    ): Promise<PartyReportData> => {
        const response = await apiClient.put<
            ApiResponse<{ party: PartyReportData }>
        >(`/mills/${millId}/parties/${partyId}`, data)
        return response.data.data.party
    },

    deleteParty: async (millId: string, partyId: string): Promise<void> => {
        await apiClient.delete(`/mills/${millId}/parties/${partyId}`)
    },

    bulkDeleteParties: async (
        millId: string,
        partyIds: string[]
    ): Promise<void> => {
        await apiClient.delete(`/mills/${millId}/parties/bulk`, {
            data: { ids: partyIds },
        })
    },
}
