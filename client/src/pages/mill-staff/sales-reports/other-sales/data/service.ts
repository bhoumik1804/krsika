import { apiClient, type ApiResponse } from '@/lib/api-client'
import type {
    CreateOtherSalesRequest,
    UpdateOtherSalesRequest,
    OtherSalesResponse,
    OtherSalesListResponse,
    OtherSalesQueryParams,
} from './types'

const BASE_PATH = '/mills'

export const fetchOtherSalesList = async (
    millId: string,
    params?: OtherSalesQueryParams
): Promise<OtherSalesListResponse> => {
    const response = await apiClient.get<ApiResponse<OtherSalesListResponse>>(
        `${BASE_PATH}/${millId}/other-sales`,
        { params }
    )
    return response.data.data
}

export const fetchOtherSalesById = async (
    millId: string,
    id: string
): Promise<OtherSalesResponse> => {
    const response = await apiClient.get<ApiResponse<OtherSalesResponse>>(
        `${BASE_PATH}/${millId}/other-sales/${id}`
    )
    return response.data.data
}

export const createOtherSales = async (
    millId: string,
    data: CreateOtherSalesRequest
): Promise<OtherSalesResponse> => {
    const response = await apiClient.post<ApiResponse<OtherSalesResponse>>(
        `${BASE_PATH}/${millId}/other-sales`,
        data
    )
    return response.data.data
}

export const updateOtherSales = async (
    millId: string,
    data: UpdateOtherSalesRequest
): Promise<OtherSalesResponse> => {
    const { _id, ...payload } = data
    const response = await apiClient.put<ApiResponse<OtherSalesResponse>>(
        `${BASE_PATH}/${millId}/other-sales/${_id}`,
        payload
    )
    return response.data.data
}

export const deleteOtherSales = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/other-sales/${id}`)
}

export const bulkDeleteOtherSales = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/other-sales/bulk`, {
        data: { ids },
    })
}
