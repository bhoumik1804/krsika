import apiClient from '@/lib/api-client'
import type {
    CreateGovtRiceOutwardRequest,
    GovtRiceOutwardListResponse,
    GovtRiceOutwardQueryParams,
    GovtRiceOutwardSummaryResponse,
    UpdateGovtRiceOutwardRequest,
} from './types'

const BASE_PATH = '/mills'

export async function fetchGovtRiceOutwardList(
    millId: string,
    params: GovtRiceOutwardQueryParams = {}
): Promise<GovtRiceOutwardListResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/govt-rice-outward`,
        { params }
    )
    return response.data.data
}

export async function fetchGovtRiceOutwardSummary(
    millId: string,
    params: Pick<GovtRiceOutwardQueryParams, 'startDate' | 'endDate'> = {}
): Promise<GovtRiceOutwardSummaryResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/govt-rice-outward/summary`,
        { params }
    )
    return response.data.data
}

export async function createGovtRiceOutward(
    millId: string,
    data: CreateGovtRiceOutwardRequest
) {
    const response = await apiClient.post(
        `${BASE_PATH}/${millId}/govt-rice-outward`,
        data
    )
    return response.data.data
}

export async function getGovtRiceOutwardById(millId: string, id: string) {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/govt-rice-outward/${id}`
    )
    return response.data.data
}

export async function updateGovtRiceOutward(
    millId: string,
    id: string,
    data: UpdateGovtRiceOutwardRequest
) {
    const response = await apiClient.put(
        `${BASE_PATH}/${millId}/govt-rice-outward/${id}`,
        data
    )
    return response.data.data
}

export async function deleteGovtRiceOutward(millId: string, id: string) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/govt-rice-outward/${id}`
    )
    return response.data.data
}

export async function bulkDeleteGovtRiceOutward(millId: string, ids: string[]) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/govt-rice-outward/bulk`,
        { data: { ids } }
    )
    return response.data.data
}
