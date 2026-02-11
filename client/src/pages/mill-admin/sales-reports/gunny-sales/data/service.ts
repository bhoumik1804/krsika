import { apiClient, type ApiResponse } from '@/lib/api-client'
import type {
    CreateGunnySalesRequest,
    UpdateGunnySalesRequest,
    GunnySalesResponse,
    GunnySalesListResponse,
    GunnySalesQueryParams,
    GunnySalesSummaryResponse,
} from './types'

const BASE_PATH = '/mills'

export const fetchGunnySalesList = async (
    millId: string,
    params?: GunnySalesQueryParams
): Promise<GunnySalesListResponse> => {
    const response = await apiClient.get<ApiResponse<GunnySalesListResponse>>(
        `${BASE_PATH}/${millId}/gunny-sales`,
        { params }
    )
    return response.data.data
}

export const fetchGunnySalesById = async (
    millId: string,
    id: string
): Promise<GunnySalesResponse> => {
    const response = await apiClient.get<ApiResponse<GunnySalesResponse>>(
        `${BASE_PATH}/${millId}/gunny-sales/${id}`
    )
    return response.data.data
}

export const fetchGunnySalesSummary = async (
    millId: string
): Promise<GunnySalesSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<GunnySalesSummaryResponse>
    >(`${BASE_PATH}/${millId}/gunny-sales/summary`)
    return response.data.data
}

export const createGunnySales = async (
    millId: string,
    data: CreateGunnySalesRequest
): Promise<GunnySalesResponse> => {
    const response = await apiClient.post<ApiResponse<GunnySalesResponse>>(
        `${BASE_PATH}/${millId}/gunny-sales`,
        data
    )
    return response.data.data
}

export const updateGunnySales = async (
    millId: string,
    data: UpdateGunnySalesRequest
): Promise<GunnySalesResponse> => {
    const { _id, ...payload } = data
    const response = await apiClient.put<ApiResponse<GunnySalesResponse>>(
        `${BASE_PATH}/${millId}/gunny-sales/${_id}`,
        payload
    )
    return response.data.data
}

export const deleteGunnySales = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/gunny-sales/${id}`)
}

export const bulkDeleteGunnySales = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/gunny-sales`, {
        data: { ids },
    })
}
