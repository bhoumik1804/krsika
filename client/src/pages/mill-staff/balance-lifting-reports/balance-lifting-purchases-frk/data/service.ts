import { apiClient } from '@/lib/api-client'
import type { BalanceLiftingPurchasesFrk } from './schema'
import type {
    BalanceLiftingFrkPurchaseListResponse,
    BalanceLiftingFrkPurchaseRequest,
    BalanceLiftingFrkPurchaseResponse,
    PaginationData,
} from './types'

interface FetchBalanceLiftingFrkPurchaseListParams {
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

export const balanceLiftingFrkPurchaseService = {
    fetchList: async (params: FetchBalanceLiftingFrkPurchaseListParams) => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.pageSize)
            queryParams.append('limit', params.pageSize.toString())
        if (params.search) queryParams.append('search', params.search)

        const response = await apiClient.get<
            ApiResponse<BalanceLiftingFrkPurchaseListResponse>
        >(`/mills/${params.millId}/frk-purchase?${queryParams.toString()}`)

        const data: BalanceLiftingPurchasesFrk[] = response.data.data.data || []

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

    create: async (
        millId: string,
        data: Omit<BalanceLiftingPurchasesFrk, '_id'>
    ) => {
        const requestData: BalanceLiftingFrkPurchaseRequest = {
            date: data.date,
            partyName: data.partyName || '',
            frkQty: data.frkQty,
            frkRate: data.frkRate,
            gst: data.gst,
        }

        const response = await apiClient.post<
            ApiResponse<BalanceLiftingFrkPurchaseResponse>
        >(`/mills/${millId}/frk-purchase`, requestData)
        return response.data.data
    },

    update: async (
        millId: string,
        purchaseId: string,
        data: Omit<BalanceLiftingPurchasesFrk, '_id'>
    ) => {
        const requestData: BalanceLiftingFrkPurchaseRequest = {
            date: data.date,
            partyName: data.partyName || '',
            frkQty: data.frkQty,
            frkRate: data.frkRate,
            gst: data.gst,
        }

        const response = await apiClient.put<
            ApiResponse<BalanceLiftingFrkPurchaseResponse>
        >(`/mills/${millId}/frk-purchase/${purchaseId}`, requestData)
        return response.data.data
    },

    delete: async (millId: string, purchaseId: string) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/frk-purchase/${purchaseId}`)
        return response.data.data
    },

    bulkDelete: async (millId: string, purchaseIds: string[]) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/frk-purchase/bulk`, { data: { ids: purchaseIds } })
        return response.data.data
    },
}
