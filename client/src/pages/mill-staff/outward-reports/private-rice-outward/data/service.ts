import apiClient from '@/lib/api-client'
import type {
    CreatePrivateRiceOutwardRequest,
    PrivateRiceOutwardListResponse,
    PrivateRiceOutwardQueryParams,
    PrivateRiceOutwardSummaryResponse,
    UpdatePrivateRiceOutwardRequest,
} from './types'

const BASE_PATH = '/mills'

export async function fetchPrivateRiceOutwardList(
    millId: string,
    params: PrivateRiceOutwardQueryParams = {}
): Promise<PrivateRiceOutwardListResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/private-rice-outward`,
        { params }
    )
    return response.data.data
}

export async function fetchPrivateRiceOutwardSummary(
    millId: string,
    params: Pick<PrivateRiceOutwardQueryParams, 'startDate' | 'endDate'> = {}
): Promise<PrivateRiceOutwardSummaryResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/private-rice-outward/summary`,
        { params }
    )
    return response.data.data
}

export async function createPrivateRiceOutward(
    millId: string,
    data: CreatePrivateRiceOutwardRequest
) {
    const response = await apiClient.post(
        `${BASE_PATH}/${millId}/private-rice-outward`,
        data
    )
    return response.data.data
}

export async function getPrivateRiceOutwardById(millId: string, id: string) {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/private-rice-outward/${id}`
    )
    return response.data.data
}

export async function updatePrivateRiceOutward(
    millId: string,
    id: string,
    data: UpdatePrivateRiceOutwardRequest
) {
    const response = await apiClient.put(
        `${BASE_PATH}/${millId}/private-rice-outward/${id}`,
        data
    )
    return response.data.data
}

export async function deletePrivateRiceOutward(millId: string, id: string) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/private-rice-outward/${id}`
    )
    return response.data.data
}

export async function bulkDeletePrivateRiceOutward(
    millId: string,
    ids: string[]
) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/private-rice-outward/bulk`,
        { data: { ids } }
    )
    return response.data.data
}
