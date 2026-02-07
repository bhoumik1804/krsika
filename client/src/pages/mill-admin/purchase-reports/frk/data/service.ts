import { apiClient } from '@/lib/api-client'
import type { FrkPurchaseData } from './schema'

interface FetchFrkPurchaseListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

interface ApiResponse<T> {
    data: T
}

export const frkPurchaseService = {
    fetchFrkPurchaseList: async (params: FetchFrkPurchaseListParams) => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.pageSize)
            queryParams.append('pageSize', params.pageSize.toString())
        if (params.search) queryParams.append('search', params.search)

        const response = await apiClient.get<
            ApiResponse<{
                frkPurchases: FrkPurchaseData[]
                pagination: Record<string, unknown>
            }>
        >(`/mills/${params.millId}/frk-purchase?${queryParams.toString()}`)
        return response.data.data.frkPurchases
    },

    createFrkPurchase: async (
        millId: string,
        data: Omit<FrkPurchaseData, 'id'>
    ) => {
        const response = await apiClient.post<ApiResponse<FrkPurchaseData>>(
            `/mills/${millId}/frk-purchase`,
            data
        )
        return response.data.data
    },

    updateFrkPurchase: async (
        millId: string,
        purchaseId: string,
        data: Omit<FrkPurchaseData, 'id'>
    ) => {
        const response = await apiClient.put<ApiResponse<FrkPurchaseData>>(
            `/mills/${millId}/frk-purchase/${purchaseId}`,
            data
        )
        return response.data.data
    },

    deleteFrkPurchase: async (millId: string, purchaseId: string) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/frk-purchase/${purchaseId}`)
        return response.data.data
    },

    bulkDeleteFrkPurchases: async (millId: string, purchaseIds: string[]) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/frk-purchase/bulk`, { data: { ids: purchaseIds } })
        return response.data.data
    },
}
