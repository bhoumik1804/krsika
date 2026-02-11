import { apiClient, type ApiResponse } from '@/lib/api-client'
import type {
    CreateNakkhiSalesRequest,
    UpdateNakkhiSalesRequest,
    NakkhiSalesResponse,
    NakkhiSalesListResponse,
    NakkhiSalesQueryParams,
    NakkhiSalesSummaryResponse,
} from './types'

const BASE_PATH = '/mills'

export const fetchNakkhiSalesList = async (
    millId: string,
    params?: NakkhiSalesQueryParams
): Promise<NakkhiSalesListResponse> => {
    const response = await apiClient.get<ApiResponse<NakkhiSalesListResponse>>(
        `${BASE_PATH}/${millId}/nakkhi-sales`,
        { params }
    )
    return response.data.data
}

export const fetchNakkhiSalesById = async (
    millId: string,
    id: string
): Promise<NakkhiSalesResponse> => {
    const response = await apiClient.get<ApiResponse<NakkhiSalesResponse>>(
        `${BASE_PATH}/${millId}/nakkhi-sales/${id}`
    )
    return response.data.data
}

export const fetchNakkhiSalesSummary = async (
    millId: string
): Promise<NakkhiSalesSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<NakkhiSalesSummaryResponse>
    >(`${BASE_PATH}/${millId}/nakkhi-sales/summary`)
    return response.data.data
}

export const createNakkhiSales = async (
    millId: string,
    data: CreateNakkhiSalesRequest
): Promise<NakkhiSalesResponse> => {
    const response = await apiClient.post<ApiResponse<NakkhiSalesResponse>>(
        `${BASE_PATH}/${millId}/nakkhi-sales`,
        data
    )
    return response.data.data
}

export const updateNakkhiSales = async (
    millId: string,
    data: UpdateNakkhiSalesRequest
): Promise<NakkhiSalesResponse> => {
    const { _id, ...payload } = data
    const response = await apiClient.put<ApiResponse<NakkhiSalesResponse>>(
        `${BASE_PATH}/${millId}/nakkhi-sales/${_id}`,
        payload
    )
    return response.data.data
}

export const deleteNakkhiSales = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/nakkhi-sales/${id}`)
}

export const bulkDeleteNakkhiSales = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/nakkhi-sales`, {
        data: { ids },
    })
}
