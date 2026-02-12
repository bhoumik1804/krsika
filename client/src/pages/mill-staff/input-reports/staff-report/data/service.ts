import { apiClient, type ApiResponse } from '@/lib/api-client'
import {
    type CreateStaffRequest,
    type UpdateStaffRequest,
    type StaffResponse,
    type StaffListResponse,
    type StaffQueryParams,
} from './types'

const BASE_PATH = '/mills'

export const fetchStaffList = async (
    millId: string,
    params?: StaffQueryParams
): Promise<StaffListResponse> => {
    const response = await apiClient.get<ApiResponse<StaffListResponse>>(
        `${BASE_PATH}/${millId}/staff-reports`,
        {
            params,
        }
    )
    return response.data.data
}

export const fetchStaffById = async (
    millId: string,
    id: string
): Promise<StaffResponse> => {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/staff-reports/${id}`
    )
    return response.data.data
}

export const createStaff = async (
    millId: string,
    data: CreateStaffRequest
): Promise<StaffResponse> => {
    const response = await apiClient.post(
        `${BASE_PATH}/${millId}/staff-reports`,
        data
    )
    return response.data.data
}

export const updateStaff = async (
    millId: string,
    data: UpdateStaffRequest
): Promise<StaffResponse> => {
    const { id, ...payload } = data
    const response = await apiClient.put(
        `${BASE_PATH}/${millId}/staff-reports/${id}`,
        payload
    )
    return response.data.data
}

export const deleteStaff = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/staff-reports/${id}`)
}

export const bulkDeleteStaff = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/staff-reports`, {
        data: { ids },
    })
}
