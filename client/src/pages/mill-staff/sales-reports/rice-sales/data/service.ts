import { apiClient, type ApiResponse } from '@/lib/api-client'
import type {
    CreateRiceSalesRequest,
    UpdateRiceSalesRequest,
    RiceSalesResponse,
    RiceSalesListResponse,
    RiceSalesQueryParams,
    RiceSalesSummaryResponse,
} from './types'

const BASE_PATH = '/mills'

export const fetchRiceSalesList = async (
    millId: string,
    params?: RiceSalesQueryParams
): Promise<RiceSalesListResponse> => {
    const response = await apiClient.get<ApiResponse<RiceSalesListResponse>>(
        `${BASE_PATH}/${millId}/rice-sales`,
        { params }
    )
    return response.data.data
}

export const fetchRiceSalesById = async (
    millId: string,
    id: string
): Promise<RiceSalesResponse> => {
    const response = await apiClient.get<ApiResponse<RiceSalesResponse>>(
        `${BASE_PATH}/${millId}/rice-sales/${id}`
    )
    return response.data.data
}

export const fetchRiceSalesSummary = async (
    millId: string
): Promise<RiceSalesSummaryResponse> => {
    const response = await apiClient.get<ApiResponse<RiceSalesSummaryResponse>>(
        `${BASE_PATH}/${millId}/rice-sales/summary`
    )
    return response.data.data
}

export const createRiceSales = async (
    millId: string,
    data: CreateRiceSalesRequest
): Promise<RiceSalesResponse> => {
    const response = await apiClient.post<ApiResponse<RiceSalesResponse>>(
        `${BASE_PATH}/${millId}/rice-sales`,
        data
    )
    return response.data.data
}

export const updateRiceSales = async (
    millId: string,
    data: UpdateRiceSalesRequest
): Promise<RiceSalesResponse> => {
    const { _id, ...payload } = data
    const response = await apiClient.put<ApiResponse<RiceSalesResponse>>(
        `${BASE_PATH}/${millId}/rice-sales/${_id}`,
        payload
    )
    return response.data.data
}

export const deleteRiceSales = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/rice-sales/${id}`)
}

export const bulkDeleteRiceSales = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/rice-sales`, {
        data: { ids },
    })
}
