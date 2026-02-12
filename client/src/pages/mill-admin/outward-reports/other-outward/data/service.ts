import apiClient from '@/lib/api-client'
import type {
    CreateOtherOutwardRequest,
    OtherOutwardListResponse,
    OtherOutwardQueryParams,
    OtherOutwardSummaryResponse,
    UpdateOtherOutwardRequest,
} from './types'

const BASE_PATH = '/mills'

export async function fetchOtherOutwardList(
    millId: string,
    params: OtherOutwardQueryParams = {}
): Promise<OtherOutwardListResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/other-outward`,
        { params }
    )
    return response.data.data
}

export async function fetchOtherOutwardSummary(
    millId: string,
    params: Pick<OtherOutwardQueryParams, 'startDate' | 'endDate'> = {}
): Promise<OtherOutwardSummaryResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/other-outward/summary`,
        { params }
    )
    return response.data.data
}

export async function createOtherOutward(
    millId: string,
    data: CreateOtherOutwardRequest
) {
    const response = await apiClient.post(
        `${BASE_PATH}/${millId}/other-outward`,
        data
    )
    return response.data.data
}

export async function getOtherOutwardById(millId: string, id: string) {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/other-outward/${id}`
    )
    return response.data.data
}

export async function updateOtherOutward(
    millId: string,
    id: string,
    data: UpdateOtherOutwardRequest
) {
    const response = await apiClient.put(
        `${BASE_PATH}/${millId}/other-outward/${id}`,
        data
    )
    return response.data.data
}

export async function deleteOtherOutward(millId: string, id: string) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/other-outward/${id}`
    )
    return response.data.data
}

export async function bulkDeleteOtherOutward(millId: string, ids: string[]) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/other-outward/bulk`,
        { data: { ids } }
    )
    return response.data.data
}
