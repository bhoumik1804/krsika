import { apiClient, type ApiResponse } from '@/lib/api-client'
import type {
    CreateKhandaSalesRequest,
    UpdateKhandaSalesRequest,
    KhandaSalesResponse,
    KhandaSalesListResponse,
    KhandaSalesQueryParams,
    KhandaSalesSummaryResponse,
} from './types'

const BASE_PATH = '/mills'

export const fetchKhandaSalesList = async (
    millId: string,
    params?: KhandaSalesQueryParams
): Promise<KhandaSalesListResponse> => {
    const response = await apiClient.get<ApiResponse<KhandaSalesListResponse>>(
        `${BASE_PATH}/${millId}/khanda-sales`,
        { params }
    )
    return response.data.data
}

export const fetchKhandaSalesById = async (
    millId: string,
    id: string
): Promise<KhandaSalesResponse> => {
    const response = await apiClient.get<ApiResponse<KhandaSalesResponse>>(
        `${BASE_PATH}/${millId}/khanda-sales/${id}`
    )
    return response.data.data
}

export const fetchKhandaSalesSummary = async (
    millId: string
): Promise<KhandaSalesSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<KhandaSalesSummaryResponse>
    >(`${BASE_PATH}/${millId}/khanda-sales/summary`)
    return response.data.data
}

export const createKhandaSales = async (
    millId: string,
    data: CreateKhandaSalesRequest
): Promise<KhandaSalesResponse> => {
    const response = await apiClient.post<ApiResponse<KhandaSalesResponse>>(
        `${BASE_PATH}/${millId}/khanda-sales`,
        data
    )
    return response.data.data
}

export const updateKhandaSales = async (
    millId: string,
    data: UpdateKhandaSalesRequest
): Promise<KhandaSalesResponse> => {
    const { _id, ...payload } = data
    const response = await apiClient.put<ApiResponse<KhandaSalesResponse>>(
        `${BASE_PATH}/${millId}/khanda-sales/${_id}`,
        payload
    )
    return response.data.data
}

export const deleteKhandaSales = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/khanda-sales/${id}`)
}

export const bulkDeleteKhandaSales = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/khanda-sales`, {
        data: { ids },
    })
}
