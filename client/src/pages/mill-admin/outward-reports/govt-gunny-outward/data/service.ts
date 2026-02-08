import apiClient from '@/lib/api-client'
import type {
    CreateGovtGunnyOutwardRequest,
    GovtGunnyOutwardListResponse,
    GovtGunnyOutwardQueryParams,
    GovtGunnyOutwardSummaryResponse,
    UpdateGovtGunnyOutwardRequest,
} from './types'

const BASE_PATH = '/mills'

export async function fetchGovtGunnyOutwardList(
    millId: string,
    params: GovtGunnyOutwardQueryParams = {}
): Promise<GovtGunnyOutwardListResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/govt-gunny-outward`,
        { params }
    )
    return response.data.data
}

export async function fetchGovtGunnyOutwardSummary(
    millId: string,
    params: Pick<GovtGunnyOutwardQueryParams, 'startDate' | 'endDate'> = {}
): Promise<GovtGunnyOutwardSummaryResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/govt-gunny-outward/summary`,
        { params }
    )
    return response.data.data
}

export async function createGovtGunnyOutward(
    millId: string,
    data: CreateGovtGunnyOutwardRequest
) {
    const response = await apiClient.post(
        `${BASE_PATH}/${millId}/govt-gunny-outward`,
        data
    )
    return response.data.data
}

export async function getGovtGunnyOutwardById(millId: string, id: string) {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/govt-gunny-outward/${id}`
    )
    return response.data.data
}

export async function updateGovtGunnyOutward(
    millId: string,
    id: string,
    data: UpdateGovtGunnyOutwardRequest
) {
    const response = await apiClient.put(
        `${BASE_PATH}/${millId}/govt-gunny-outward/${id}`,
        data
    )
    return response.data.data
}

export async function deleteGovtGunnyOutward(millId: string, id: string) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/govt-gunny-outward/${id}`
    )
    return response.data.data
}

export async function bulkDeleteGovtGunnyOutward(
    millId: string,
    ids: string[]
) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/govt-gunny-outward/bulk`,
        { data: { ids } }
    )
    return response.data.data
}
