import { apiClient } from '@/lib/api-client'
import type { OtherPurchase } from './schema'

interface FetchOtherPurchaseListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

interface ApiResponse<T> {
    data: T
}

export const otherPurchaseService = {
    fetchOtherPurchaseList: async (params: FetchOtherPurchaseListParams) => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.pageSize)
            queryParams.append('pageSize', params.pageSize.toString())
        if (params.search) queryParams.append('search', params.search)

        const response = await apiClient.get<
            ApiResponse<{
                purchases: Array<OtherPurchase & { _id: string }>
                pagination: Record<string, unknown>
            }>
        >(`/mills/${params.millId}/other-purchase?${queryParams.toString()}`)

        // Map _id to id for consistency
        const data = response.data.data.purchases.map((item) => ({
            ...item,
            id: item._id,
        }))

        return {
            data,
            pagination: response.data.data.pagination,
        }
    },

    createOtherPurchase: async (
        millId: string,
        data: Omit<OtherPurchase, 'id'>
    ) => {
        const response = await apiClient.post<ApiResponse<OtherPurchase>>(
            `/mills/${millId}/other-purchase`,
            data
        )
        return response.data.data
    },

    updateOtherPurchase: async (
        millId: string,
        purchaseId: string,
        data: Omit<OtherPurchase, 'id'>
    ) => {
        const response = await apiClient.put<ApiResponse<OtherPurchase>>(
            `/mills/${millId}/other-purchase/${purchaseId}`,
            data
        )
        return response.data.data
    },

    deleteOtherPurchase: async (millId: string, purchaseId: string) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/other-purchase/${purchaseId}`)
        return response.data.data
    },

    bulkDeleteOtherPurchases: async (millId: string, purchaseIds: string[]) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/other-purchase/bulk`, {
            data: { ids: purchaseIds },
        })
        return response.data.data
    },
}
