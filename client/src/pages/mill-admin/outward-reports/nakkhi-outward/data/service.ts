import apiClient from '@/lib/api-client'
import type {
    NakkhiOutwardQueryParams,
    NakkhiOutwardListResponse,
    NakkhiOutwardSummaryResponse,
    CreateNakkhiOutwardRequest,
    UpdateNakkhiOutwardRequest,
} from './types'

const BASE_PATH = '/mills'

export async function fetchNakkhiOutwardList(
    millId: string,
    params: NakkhiOutwardQueryParams = {}
): Promise<NakkhiOutwardListResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/nakkhi-outward`,
        { params }
    )
    return response.data.data
}

export async function fetchNakkhiOutwardSummary(
    millId: string,
    params: Pick<NakkhiOutwardQueryParams, 'startDate' | 'endDate'> = {}
): Promise<NakkhiOutwardSummaryResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/nakkhi-outward/summary`,
        { params }
    )
    return response.data.data
}

export async function createNakkhiOutward(
    millId: string,
    data: CreateNakkhiOutwardRequest
) {
    const response = await apiClient.post(
        `${BASE_PATH}/${millId}/nakkhi-outward`,
        data
    )
    return response.data.data
}

export async function getNakkhiOutwardById(millId: string, id: string) {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/nakkhi-outward/${id}`
    )
    return response.data.data
}

export async function updateNakkhiOutward(
    millId: string,
    id: string,
    data: UpdateNakkhiOutwardRequest
) {
    const response = await apiClient.put(
        `${BASE_PATH}/${millId}/nakkhi-outward/${id}`,
        data
    )
    return response.data.data
}

export async function deleteNakkhiOutward(millId: string, id: string) {
    await apiClient.delete(`${BASE_PATH}/${millId}/nakkhi-outward/${id}`)
}

export async function bulkDeleteNakkhiOutward(millId: string, ids: string[]) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/nakkhi-outward/bulk`,
        { data: { ids } }
    )
    return response.data
}
