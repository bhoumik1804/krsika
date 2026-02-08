import { apiClient, type ApiResponse } from '@/lib/api-client'
import type {
    CreateLabourGroupRequest,
    UpdateLabourGroupRequest,
    LabourGroupResponse,
    LabourGroupListResponse,
    LabourGroupQueryParams,
    LabourGroupSummaryResponse,
} from './types'

const BASE_PATH = '/mills'

export const fetchLabourGroupList = async (
    millId: string,
    params?: LabourGroupQueryParams
): Promise<LabourGroupListResponse> => {
    const response = await apiClient.get<ApiResponse<LabourGroupListResponse>>(
        `${BASE_PATH}/${millId}/labour-groups`,
        { params }
    )
    return response.data.data
}

export const fetchLabourGroupById = async (
    millId: string,
    id: string
): Promise<LabourGroupResponse> => {
    const response = await apiClient.get<ApiResponse<LabourGroupResponse>>(
        `${BASE_PATH}/${millId}/labour-groups/${id}`
    )
    return response.data.data
}

export const fetchLabourGroupSummary = async (
    millId: string
): Promise<LabourGroupSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<LabourGroupSummaryResponse>
    >(`${BASE_PATH}/${millId}/labour-groups/summary`)
    return response.data.data
}

export const createLabourGroup = async (
    millId: string,
    data: CreateLabourGroupRequest
): Promise<LabourGroupResponse> => {
    const response = await apiClient.post<ApiResponse<LabourGroupResponse>>(
        `${BASE_PATH}/${millId}/labour-groups`,
        data
    )
    return response.data.data
}

export const updateLabourGroup = async (
    millId: string,
    data: UpdateLabourGroupRequest
): Promise<LabourGroupResponse> => {
    const { id, ...payload } = data
    const response = await apiClient.put<ApiResponse<LabourGroupResponse>>(
        `${BASE_PATH}/${millId}/labour-groups/${id}`,
        payload
    )
    return response.data.data
}

export const deleteLabourGroup = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/labour-groups/${id}`)
}

export const bulkDeleteLabourGroup = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/labour-groups`, {
        data: { ids },
    })
}
