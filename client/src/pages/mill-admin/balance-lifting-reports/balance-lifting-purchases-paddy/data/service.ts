import { apiClient, type ApiResponse } from '@/lib/api-client'
import type { BalanceLiftingPurchasesPaddy } from './schema'
import type {
    BalanceLiftingPaddyPurchaseListResponse,
    BalanceLiftingPaddyPurchaseRequest,
    BalanceLiftingPaddyPurchaseResponse,
    PaginationData,
} from './types'

interface FetchBalanceLiftingPaddyPurchaseListParams {
    millId: string
    page?: number
    pageSize?: number
    search?: string
}

export const balanceLiftingPaddyPurchaseService = {
    fetchList: async (params: FetchBalanceLiftingPaddyPurchaseListParams) => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.pageSize)
            queryParams.append('limit', params.pageSize.toString())
        if (params.search) queryParams.append('search', params.search)

        const response = await apiClient.get<
            ApiResponse<BalanceLiftingPaddyPurchaseListResponse>
        >(`/mills/${params.millId}/paddy-purchase?${queryParams.toString()}`)

        const data: BalanceLiftingPurchasesPaddy[] =
            response.data.data.data || []

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
        data: Omit<BalanceLiftingPurchasesPaddy, '_id'>
    ) => {
        const requestData: BalanceLiftingPaddyPurchaseRequest = {
            date: data.date,
            partyName: data.partyName || undefined,
            brokerName: data.brokerName || undefined,
            deliveryType: data.deliveryType || undefined,
            purchaseType: data.purchaseType || undefined,
            doNumber: data.doNumber || undefined,
            committeeName: data.committeeName || undefined,
            doPaddyQty: data.doPaddyQty,
            paddyType: data.paddyType || undefined,
            totalPaddyQty: data.totalPaddyQty,
            paddyRatePerQuintal: data.paddyRatePerQuintal,
            discountPercent: data.discountPercent,
            brokerage: data.brokerage,
            gunnyType: data.gunnyType || undefined,
            newGunnyRate: data.newGunnyRate,
            oldGunnyRate: data.oldGunnyRate,
            plasticGunnyRate: data.plasticGunnyRate,
        }

        const response = await apiClient.post<
            ApiResponse<BalanceLiftingPaddyPurchaseResponse>
        >(`/mills/${millId}/paddy-purchase`, requestData)
        return response.data.data
    },

    update: async (
        millId: string,
        purchaseId: string,
        data: Omit<BalanceLiftingPurchasesPaddy, '_id'>
    ) => {
        const requestData: BalanceLiftingPaddyPurchaseRequest = {
            date: data.date,
            partyName: data.partyName || undefined,
            brokerName: data.brokerName || undefined,
            deliveryType: data.deliveryType || undefined,
            purchaseType: data.purchaseType || undefined,
            doNumber: data.doNumber || undefined,
            committeeName: data.committeeName || undefined,
            doPaddyQty: data.doPaddyQty,
            paddyType: data.paddyType || undefined,
            totalPaddyQty: data.totalPaddyQty,
            paddyRatePerQuintal: data.paddyRatePerQuintal,
            discountPercent: data.discountPercent,
            brokerage: data.brokerage,
            gunnyType: data.gunnyType || undefined,
            newGunnyRate: data.newGunnyRate,
            oldGunnyRate: data.oldGunnyRate,
            plasticGunnyRate: data.plasticGunnyRate,
        }

        const response = await apiClient.put<
            ApiResponse<BalanceLiftingPaddyPurchaseResponse>
        >(`/mills/${millId}/paddy-purchase/${purchaseId}`, requestData)
        return response.data.data
    },

    delete: async (millId: string, purchaseId: string) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/paddy-purchase/${purchaseId}`)
        return response.data.data
    },

    bulkDelete: async (millId: string, purchaseIds: string[]) => {
        const response = await apiClient.delete<
            ApiResponse<{ success: boolean }>
        >(`/mills/${millId}/paddy-purchase/bulk`, {
            data: { ids: purchaseIds },
        })
        return response.data.data
    },

    fetchPaddyInwardsByDealNumber: async (
        millId: string,
        dealNumber: string
    ) => {
        const response = await apiClient.get<
            ApiResponse<{ data: any[]; pagination: any }>
        >(`/mills/${millId}/private-paddy-inward?search=${dealNumber}`)
        return response.data.data.data
    },
}
