import { apiClient } from '@/lib/api-client'
import type { OtherInward } from './schema'
import type {
    OtherInwardQueryParams,
    OtherInwardListResponse,
    OtherInwardSummaryResponse,
    CreateOtherInwardRequest,
    UpdateOtherInwardRequest,
} from './types'

interface ApiResponse<T> {
    data: T
}

export const otherInwardService = {
    fetchOtherInwardList: async (
        millId: string,
        params: OtherInwardQueryParams
    ): Promise<OtherInwardListResponse> => {
        const queryParams = new URLSearchParams()

        if (params.page) queryParams.append('page', params.page.toString())
        if (params.limit) queryParams.append('limit', params.limit.toString())
        if (params.search) queryParams.append('search', params.search)
        if (params.itemName) queryParams.append('itemName', params.itemName)
        if (params.partyName) queryParams.append('partyName', params.partyName)
        if (params.brokerName)
            queryParams.append('brokerName', params.brokerName)
        if (params.startDate) queryParams.append('startDate', params.startDate)
        if (params.endDate) queryParams.append('endDate', params.endDate)
        if (params.sortBy) queryParams.append('sortBy', params.sortBy)
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

        const response = await apiClient.get<
            ApiResponse<OtherInwardListResponse>
        >(`/mills/${millId}/other-inward?${queryParams.toString()}`)

        return response.data.data
    },

    fetchOtherInwardSummary: async (
        millId: string,
        params?: Pick<OtherInwardQueryParams, 'startDate' | 'endDate'>
    ): Promise<OtherInwardSummaryResponse> => {
        const queryParams = new URLSearchParams()

        if (params?.startDate) queryParams.append('startDate', params.startDate)
        if (params?.endDate) queryParams.append('endDate', params.endDate)

        const response = await apiClient.get<
            ApiResponse<OtherInwardSummaryResponse>
        >(`/mills/${millId}/other-inward/summary?${queryParams.toString()}`)

        return response.data.data
    },

    createOtherInward: async (
        millId: string,
        data: CreateOtherInwardRequest
    ): Promise<OtherInward> => {
        const response = await apiClient.post<ApiResponse<OtherInward>>(
            `/mills/${millId}/other-inward`,
            data
        )
        return response.data.data
    },

    updateOtherInward: async (
        millId: string,
        entryId: string,
        data: UpdateOtherInwardRequest
    ): Promise<OtherInward> => {
        const response = await apiClient.put<ApiResponse<OtherInward>>(
            `/mills/${millId}/other-inward/${entryId}`,
            data
        )
        return response.data.data
    },

    deleteOtherInward: async (
        millId: string,
        entryId: string
    ): Promise<{ success: boolean }> => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/other-inward/${entryId}`)
        return response.data.data
    },

    bulkDeleteOtherInward: async (
        millId: string,
        entryIds: string[]
    ): Promise<{ success: boolean }> => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/other-inward/bulk`, {
            data: { ids: entryIds },
        })
        return response.data.data
    },
}
