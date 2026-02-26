import apiClient, { type ApiResponse } from '@/lib/api-client'
import type { BrokerReportData } from './schema'

// ==========================================
// Types
// ==========================================

interface FetchBrokerListParams {
    millId: string
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface BrokerListResponse {
    brokers: BrokerReportData[]
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

export const brokerService = {
    fetchBrokerList: async (
        params: FetchBrokerListParams
    ): Promise<BrokerListResponse> => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.limit) queryParams.append('limit', params.limit.toString())
        if (params.search) queryParams.append('search', params.search)
        if (params.sortBy) queryParams.append('sortBy', params.sortBy)
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

        const response = await apiClient.get<ApiResponse<BrokerListResponse>>(
            `/mills/${params.millId}/brokers?${queryParams.toString()}`
        )
        return response.data.data
    },

    createBroker: async (
        millId: string,
        data: Partial<BrokerReportData>
    ): Promise<BrokerReportData> => {
        const response = await apiClient.post<
            ApiResponse<{ broker: BrokerReportData }>
        >(`/mills/${millId}/brokers`, data)
        return response.data.data.broker
    },

    updateBroker: async (
        millId: string,
        brokerId: string,
        data: Partial<BrokerReportData>
    ): Promise<BrokerReportData> => {
        const response = await apiClient.put<
            ApiResponse<{ broker: BrokerReportData }>
        >(`/mills/${millId}/brokers/${brokerId}`, data)
        return response.data.data.broker
    },

    deleteBroker: async (millId: string, brokerId: string): Promise<void> => {
        await apiClient.delete(`/mills/${millId}/brokers/${brokerId}`)
    },

    bulkDeleteBrokers: async (
        millId: string,
        brokerIds: string[]
    ): Promise<void> => {
        await apiClient.delete(`/mills/${millId}/brokers/bulk`, {
            data: { ids: brokerIds },
        })
    },
}
