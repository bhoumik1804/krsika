import { apiClient } from '@/lib/api-client'
import type { GunnyPurchaseData } from './schema'

interface FetchGunnyPurchaseListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

interface ApiResponse<T> {
    data: T
}

export const gunnyPurchaseService = {
    fetchGunnyPurchaseList: async (params: FetchGunnyPurchaseListParams) => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.pageSize)
            queryParams.append('pageSize', params.pageSize.toString())
        if (params.search) queryParams.append('search', params.search)

        const response = await apiClient.get<
            ApiResponse<{
                purchases: Array<GunnyPurchaseData & { _id: string }>
                pagination: Record<string, unknown>
            }>
        >(`/mills/${params.millId}/gunny-purchase?${queryParams.toString()}`)

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

    createGunnyPurchase: async (
        millId: string,
        data: Omit<GunnyPurchaseData, 'id'>
    ) => {
        const response = await apiClient.post<ApiResponse<GunnyPurchaseData>>(
            `/mills/${millId}/gunny-purchase`,
            data
        )
        return response.data.data
    },

    updateGunnyPurchase: async (
        millId: string,
        purchaseId: string,
        data: Omit<GunnyPurchaseData, 'id'>
    ) => {
        const response = await apiClient.put<ApiResponse<GunnyPurchaseData>>(
            `/mills/${millId}/gunny-purchase/${purchaseId}`,
            data
        )
        return response.data.data
    },

    deleteGunnyPurchase: async (millId: string, purchaseId: string) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/gunny-purchase/${purchaseId}`)
        return response.data.data
    },

    bulkDeleteGunnyPurchases: async (millId: string, purchaseIds: string[]) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/gunny-purchase/bulk`, {
            data: { ids: purchaseIds },
        })
        return response.data.data
    },
}
