import { apiClient } from '@/lib/api-client'
import type { PaddyPurchaseData } from './schema'

interface FetchPaddyPurchaseListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

interface ApiResponse<T> {
    data: T
}

export const paddyPurchaseService = {
    fetchPaddyPurchaseList: async (params: FetchPaddyPurchaseListParams) => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.pageSize)
            queryParams.append('pageSize', params.pageSize.toString())
        if (params.search) queryParams.append('search', params.search)

        const response = await apiClient.get<
            ApiResponse<{
                paddyPurchases: PaddyPurchaseData[]
                pagination: Record<string, unknown>
            }>
        >(`/mills/${params.millId}/paddy-purchase?${queryParams.toString()}`)
        return response.data.data.paddyPurchases
    },

    createPaddyPurchase: async (
        millId: string,
        data: Omit<PaddyPurchaseData, 'id'>
    ) => {
        const response = await apiClient.post<
            ApiResponse<PaddyPurchaseData>
        >(`/mills/${millId}/paddy-purchase`, data)
        return response.data.data
    },

    updatePaddyPurchase: async (
        millId: string,
        purchaseId: string,
        data: Omit<PaddyPurchaseData, 'id'>
    ) => {
        const response = await apiClient.put<ApiResponse<PaddyPurchaseData>>(
            `/mills/${millId}/paddy-purchase/${purchaseId}`,
            data
        )
        return response.data.data
    },

    deletePaddyPurchase: async (millId: string, purchaseId: string) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/paddy-purchase/${purchaseId}`)
        return response.data.data
    },

    bulkDeletePaddyPurchases: async (millId: string, purchaseIds: string[]) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/paddy-purchase/bulk`, { data: { ids: purchaseIds } })
        return response.data.data
    },
}
