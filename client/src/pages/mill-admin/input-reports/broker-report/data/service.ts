import { apiClient } from '@/lib/api-client'
import type { BrokerReportData } from './schema'

interface FetchBrokerListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

export interface BrokerListResponse {
    brokers: BrokerReportData[]
    pagination: {
        page: number
        pageSize: number
        total: number
        pages: number
    }
}

interface ApiResponse<T> {
    data: T
}

export const brokerService = {
    fetchBrokerList: async (params: FetchBrokerListParams): Promise<BrokerListResponse> => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.pageSize)
            queryParams.append('pageSize', params.pageSize.toString())
        if (params.search) queryParams.append('search', params.search)

        const response = await apiClient.get<
            ApiResponse<BrokerListResponse>
        >(`/mills/${params.millId}/brokers?${queryParams.toString()}`)
        return response.data.data
    },

    createBroker: async (
        millId: string,
        data: Omit<BrokerReportData, 'id'>
    ) => {
        const response = await apiClient.post<ApiResponse<BrokerReportData>>(
            `/mills/${millId}/brokers`,
            data
        )
        return response.data.data
    },

    updateBroker: async (
        millId: string,
        brokerId: string,
        data: Omit<BrokerReportData, 'id'>
    ) => {
        const response = await apiClient.patch<ApiResponse<BrokerReportData>>(
            `/mills/${millId}/brokers/${brokerId}`,
            data
        )
        return response.data.data
    },

    deleteBroker: async (millId: string, brokerId: string) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/brokers/${brokerId}`)
        return response.data.data
    },

    bulkDeleteBrokers: async (millId: string, brokerIds: string[]) => {
        const response = await apiClient.post<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/brokers/bulk-delete`, { ids: brokerIds })
        return response.data.data
    },
}
