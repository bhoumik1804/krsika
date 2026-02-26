import apiClient from '@/lib/api-client'
import type {
    KhandaOutwardQueryParams,
    KhandaOutwardListResponse,
    KhandaOutwardSummaryResponse,
    CreateKhandaOutwardRequest,
    UpdateKhandaOutwardRequest,
} from './types'

const BASE_PATH = '/mills'

export async function fetchKhandaOutwardList(
    millId: string,
    params: KhandaOutwardQueryParams = {}
): Promise<KhandaOutwardListResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/khanda-outward`,
        { params }
    )
    return response.data.data
}

export async function fetchKhandaOutwardSummary(
    millId: string,
    params: Pick<KhandaOutwardQueryParams, 'startDate' | 'endDate'> = {}
): Promise<KhandaOutwardSummaryResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/khanda-outward/summary`,
        { params }
    )
    return response.data.data
}

export async function createKhandaOutward(
    millId: string,
    data: CreateKhandaOutwardRequest
) {
    const response = await apiClient.post(
        `${BASE_PATH}/${millId}/khanda-outward`,
        data
    )
    return response.data.data
}

export async function getKhandaOutwardById(millId: string, id: string) {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/khanda-outward/${id}`
    )
    return response.data.data
}

export async function updateKhandaOutward(
    millId: string,
    id: string,
    data: UpdateKhandaOutwardRequest
) {
    const response = await apiClient.put(
        `${BASE_PATH}/${millId}/khanda-outward/${id}`,
        data
    )
    return response.data.data
}

export async function deleteKhandaOutward(millId: string, id: string) {
    await apiClient.delete(`${BASE_PATH}/${millId}/khanda-outward/${id}`)
}

export async function bulkDeleteKhandaOutward(millId: string, ids: string[]) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/khanda-outward/bulk`,
        { data: { ids } }
    )
    return response.data
}
