import apiClient from '@/lib/api-client'
import type {
    CreateKodhaOutwardRequest,
    KodhaOutwardListResponse,
    KodhaOutwardQueryParams,
    KodhaOutwardSummaryResponse,
    UpdateKodhaOutwardRequest,
} from './types'

const BASE_PATH = '/mills'

export async function fetchKodhaOutwardList(
    millId: string,
    params: KodhaOutwardQueryParams = {}
): Promise<KodhaOutwardListResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/kodha-outward`,
        { params }
    )
    return response.data.data
}

export async function fetchKodhaOutwardSummary(
    millId: string,
    params: Pick<KodhaOutwardQueryParams, 'startDate' | 'endDate'> = {}
): Promise<KodhaOutwardSummaryResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/kodha-outward/summary`,
        { params }
    )
    return response.data.data
}

export async function createKodhaOutward(
    millId: string,
    data: CreateKodhaOutwardRequest
) {
    const response = await apiClient.post(
        `${BASE_PATH}/${millId}/kodha-outward`,
        data
    )
    return response.data.data
}

export async function getKodhaOutwardById(millId: string, id: string) {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/kodha-outward/${id}`
    )
    return response.data.data
}

export async function updateKodhaOutward(
    millId: string,
    id: string,
    data: UpdateKodhaOutwardRequest
) {
    const response = await apiClient.put(
        `${BASE_PATH}/${millId}/kodha-outward/${id}`,
        data
    )
    return response.data.data
}

export async function deleteKodhaOutward(millId: string, id: string) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/kodha-outward/${id}`
    )
    return response.data.data
}

export async function bulkDeleteKodhaOutward(millId: string, ids: string[]) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/kodha-outward/bulk`,
        { data: { ids } }
    )
    return response.data.data
}
