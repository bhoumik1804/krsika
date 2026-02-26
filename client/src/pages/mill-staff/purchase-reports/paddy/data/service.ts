import { apiClient, type ApiResponse } from '@/lib/api-client'
import type {
    CreatePaddyPurchaseRequest,
    UpdatePaddyPurchaseRequest,
    PaddyPurchaseResponse,
    PaddyPurchaseListResponse,
    PaddyPurchaseQueryParams,
    PaddyPurchaseSummaryResponse,
} from './types'

const BASE_PATH = '/mills'

export const fetchPaddyPurchaseList = async (
    millId: string,
    params?: PaddyPurchaseQueryParams
): Promise<PaddyPurchaseListResponse> => {
    const response = await apiClient.get<
        ApiResponse<PaddyPurchaseListResponse>
    >(`${BASE_PATH}/${millId}/paddy-purchase`, { params })
    return response.data.data
}

export const fetchPaddyPurchaseById = async (
    millId: string,
    id: string
): Promise<PaddyPurchaseResponse> => {
    const response = await apiClient.get<ApiResponse<PaddyPurchaseResponse>>(
        `${BASE_PATH}/${millId}/paddy-purchase/${id}`
    )
    return response.data.data
}

export const fetchPaddyPurchaseSummary = async (
    millId: string
): Promise<PaddyPurchaseSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<PaddyPurchaseSummaryResponse>
    >(`${BASE_PATH}/${millId}/paddy-purchase/summary`)
    return response.data.data
}

export const createPaddyPurchase = async (
    millId: string,
    data: CreatePaddyPurchaseRequest
): Promise<PaddyPurchaseResponse> => {
    const response = await apiClient.post<ApiResponse<PaddyPurchaseResponse>>(
        `${BASE_PATH}/${millId}/paddy-purchase`,
        data
    )
    return response.data.data
}

export const updatePaddyPurchase = async (
    millId: string,
    data: UpdatePaddyPurchaseRequest
): Promise<PaddyPurchaseResponse> => {
    const { _id, ...payload } = data
    const response = await apiClient.put<ApiResponse<PaddyPurchaseResponse>>(
        `${BASE_PATH}/${millId}/paddy-purchase/${_id}`,
        payload
    )
    return response.data.data
}

export const deletePaddyPurchase = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/paddy-purchase/${id}`)
}

export const bulkDeletePaddyPurchase = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/paddy-purchase/bulk`, {
        data: { ids },
    })
}
