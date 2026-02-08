import { apiClient } from '@/lib/api-client'
import type { FrkPurchaseData } from './schema'
import type {
    FrkPurchaseListResponse,
    FrkPurchaseRequest,
    FrkPurchaseResponse,
    PaginationData,
} from './types'

interface FetchFrkPurchaseListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

interface ApiResponse<T> {
    statusCode: number
    data: T
    message: string
    success: boolean
}

export const frkPurchaseService = {
    fetchFrkPurchaseList: async (params: FetchFrkPurchaseListParams) => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.pageSize)
            queryParams.append('limit', params.pageSize.toString())
        if (params.search) queryParams.append('search', params.search)

        const response = await apiClient.get<ApiResponse<FrkPurchaseListResponse>>(
            `/mills/${params.millId}/frk-purchase?${queryParams.toString()}`
        )

        const data: FrkPurchaseData[] = response.data.data.purchases || []

        const pagination: PaginationData = response.data.data.pagination || {
            page: params.page || 1,
            limit: params.pageSize || 10,
            total: 0,
            totalPages: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: null,
            nextPage: null,
        }

        return { data, pagination }
    },

    createFrkPurchase: async (
        millId: string,
        data: Omit<FrkPurchaseData, '_id'>
    ) => {
        const requestData: FrkPurchaseRequest = {
            date: data.date,
            partyName: data.partyName,
            frkQty: data.frkQty,
            frkRate: data.frkRate,
            gst: data.gst,
        }

        const response = await apiClient.post<ApiResponse<FrkPurchaseResponse>>(
            `/mills/${millId}/frk-purchase`,
            requestData
        )
        return response.data.data
    },

    updateFrkPurchase: async (
        millId: string,
        purchaseId: string,
        data: Omit<FrkPurchaseData, '_id'>
    ) => {
        const requestData: FrkPurchaseRequest = {
            date: data.date,
            partyName: data.partyName,
            frkQty: data.frkQty,
            frkRate: data.frkRate,
            gst: data.gst,
        }

        const response = await apiClient.put<ApiResponse<FrkPurchaseResponse>>(
            `/mills/${millId}/frk-purchase/${purchaseId}`,
            requestData
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
