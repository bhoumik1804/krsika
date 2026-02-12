import apiClient from '@/lib/api-client'
import type {
    BhusaOutwardQueryParams,
    BhusaOutwardListResponse,
    BhusaOutwardSummaryResponse,
    CreateBhusaOutwardRequest,
    UpdateBhusaOutwardRequest,
} from './types'

const BASE_PATH = '/mills'

export async function fetchBhusaOutwardList(
    millId: string,
    params: BhusaOutwardQueryParams = {}
): Promise<BhusaOutwardListResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/bhusa-outward`,
        { params }
    )
    return response.data.data
}

export async function fetchBhusaOutwardSummary(
    millId: string,
    params: Pick<BhusaOutwardQueryParams, 'startDate' | 'endDate'> = {}
): Promise<BhusaOutwardSummaryResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/bhusa-outward/summary`,
        { params }
    )
    return response.data.data
}

export async function createBhusaOutward(
    millId: string,
    data: CreateBhusaOutwardRequest
) {
    const response = await apiClient.post(
        `${BASE_PATH}/${millId}/bhusa-outward`,
        data
    )
    return response.data.data
}

export async function getBhusaOutwardById(millId: string, id: string) {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/bhusa-outward/${id}`
    )
    return response.data.data
}

export async function updateBhusaOutward(
    millId: string,
    id: string,
    data: UpdateBhusaOutwardRequest
) {
    const response = await apiClient.put(
        `${BASE_PATH}/${millId}/bhusa-outward/${id}`,
        data
    )
    return response.data.data
}

export async function deleteBhusaOutward(millId: string, id: string) {
    await apiClient.delete(`${BASE_PATH}/${millId}/bhusa-outward/${id}`)
}

export async function bulkDeleteBhusaOutward(millId: string, ids: string[]) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/bhusa-outward/bulk`,
        { data: { ids } }
    )
    return response.data
}
