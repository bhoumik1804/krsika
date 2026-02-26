import apiClient from '@/lib/api-client'
import type {
    CreateSilkyKodhaOutwardRequest,
    SilkyKodhaOutwardListResponse,
    SilkyKodhaOutwardQueryParams,
    SilkyKodhaOutwardSummaryResponse,
    UpdateSilkyKodhaOutwardRequest,
} from './types'

const BASE_PATH = '/mills'

export async function fetchSilkyKodhaOutwardList(
    millId: string,
    params: SilkyKodhaOutwardQueryParams = {}
): Promise<SilkyKodhaOutwardListResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/silky-kodha-outward`,
        { params }
    )
    return response.data.data
}

export async function fetchSilkyKodhaOutwardSummary(
    millId: string,
    params: Pick<SilkyKodhaOutwardQueryParams, 'startDate' | 'endDate'> = {}
): Promise<SilkyKodhaOutwardSummaryResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/silky-kodha-outward/summary`,
        { params }
    )
    return response.data.data
}

export async function createSilkyKodhaOutward(
    millId: string,
    data: CreateSilkyKodhaOutwardRequest
) {
    const response = await apiClient.post(
        `${BASE_PATH}/${millId}/silky-kodha-outward`,
        data
    )
    return response.data.data
}

export async function getSilkyKodhaOutwardById(millId: string, id: string) {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/silky-kodha-outward/${id}`
    )
    return response.data.data
}

export async function updateSilkyKodhaOutward(
    millId: string,
    id: string,
    data: UpdateSilkyKodhaOutwardRequest
) {
    const response = await apiClient.put(
        `${BASE_PATH}/${millId}/silky-kodha-outward/${id}`,
        data
    )
    return response.data.data
}

export async function deleteSilkyKodhaOutward(millId: string, id: string) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/silky-kodha-outward/${id}`
    )
    return response.data.data
}

export async function bulkDeleteSilkyKodhaOutward(
    millId: string,
    ids: string[]
) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/silky-kodha-outward/bulk`,
        { data: { ids } }
    )
    return response.data.data
}
