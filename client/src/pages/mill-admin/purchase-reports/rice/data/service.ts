import { apiClient } from '@/lib/api-client'
import type { RicePurchaseData } from './schema'

interface FetchRicePurchaseListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

interface ApiResponse<T> {
    data: T
}

export const ricePurchaseService = {
    fetchRicePurchaseList: async (params: FetchRicePurchaseListParams) => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.pageSize)
            queryParams.append('pageSize', params.pageSize.toString())
        if (params.search) queryParams.append('search', params.search)

        const response = await apiClient.get<
            ApiResponse<{
                data: Array<RicePurchaseData & { _id: string }>
                pagination: Record<string, unknown>
            }>
        >(`/mills/${params.millId}/rice-purchase?${queryParams.toString()}`)

        // Map _id to id for consistency
        const data = response.data.data.data.map((item) => ({
            ...item,
            id: item._id,
        }))

        return {
            data,
            pagination: response.data.data.pagination,
        }
    },

    createRicePurchase: async (
        millId: string,
        data: Omit<RicePurchaseData, 'id'>
    ) => {
        const response = await apiClient.post<ApiResponse<RicePurchaseData>>(
            `/mills/${millId}/rice-purchase`,
            data
        )
        return response.data.data
    },

    updateRicePurchase: async (
        millId: string,
        purchaseId: string,
        data: Omit<RicePurchaseData, 'id'>
    ) => {
        const response = await apiClient.put<ApiResponse<RicePurchaseData>>(
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
