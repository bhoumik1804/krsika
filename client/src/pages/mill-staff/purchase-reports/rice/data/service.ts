import { apiClient } from '@/lib/api-client'
import type { RicePurchaseData } from './schema'
import type {
    RicePurchaseListResponse,
    RicePurchaseResponse,
    PaginationData,
} from './types'

interface FetchRicePurchaseListParams {
    millId: string
    page?: number
    limit?: number
    search?: string
}

interface ApiResponse<T> {
    data: T
}

export const ricePurchaseService = {
    fetchRicePurchaseList: async (
        params: FetchRicePurchaseListParams
    ): Promise<RicePurchaseListResponse> => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.limit) queryParams.append('limit', params.limit.toString())
        if (params.search) queryParams.append('search', params.search)

        const response = await apiClient.get<
            ApiResponse<{
                data: RicePurchaseResponse[]
                pagination: PaginationData
            }>
        >(`/mills/${params.millId}/rice-purchase?${queryParams.toString()}`)

        return {
            data: response.data.data.data,
            pagination: response.data.data.pagination,
        }
    },

    createRicePurchase: async (
        millId: string,
        data: Omit<RicePurchaseData, 'id'>
    ): Promise<RicePurchaseResponse> => {
        const response = await apiClient.post<
            ApiResponse<RicePurchaseResponse>
        >(`/mills/${millId}/rice-purchase`, data)
        return response.data.data
    },

    updateRicePurchase: async (
        millId: string,
        purchaseId: string,
        data: Omit<RicePurchaseData, 'id'>
    ): Promise<RicePurchaseResponse> => {
        const response = await apiClient.put<ApiResponse<RicePurchaseResponse>>(
            `/mills/${millId}/rice-purchase/${purchaseId}`,
            data
        )
        return response.data.data
    },

    deleteRicePurchase: async (millId: string, purchaseId: string) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/rice-purchase/${purchaseId}`)
        return response.data.data
    },

    bulkDeleteRicePurchases: async (millId: string, purchaseIds: string[]) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/rice-purchase/bulk`, { data: { ids: purchaseIds } })
        return response.data.data
    },
}
