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
    const response = await apiClient.get(`${BASE_PATH}/${millId}/rice-sales`, {
        params,
    })
    // Map backend 'sales' to frontend 'entries' if needed,
    // but the types.ts was updated to expect 'entries'.
    // Actually, the backend returns { sales: [], pagination: {} }
    const { sales, pagination } = response.data.data
    return {
        entries: sales || [],
        pagination: pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: null,
            nextPage: null,
        },
    }
}

export async function fetchPrivateRiceOutwardSummary(
    millId: string,
    params: Pick<PrivateRiceOutwardQueryParams, 'startDate' | 'endDate'> = {}
): Promise<PrivateRiceOutwardSummaryResponse> {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/rice-sales/summary`,
        { params }
    )
    return response.data.data
}

export async function createPrivateRiceOutward(
    millId: string,
    data: CreatePrivateRiceOutwardRequest
) {
    const response = await apiClient.post(
        `${BASE_PATH}/${millId}/rice-sales`,
        data
    )
    return response.data.data
}

export async function getPrivateRiceOutwardById(millId: string, id: string) {
    const response = await apiClient.get(
        `${BASE_PATH}/${millId}/rice-sales/${id}`
    )
    return response.data.data
}

export async function updatePrivateRiceOutward(
    millId: string,
    id: string,
    data: UpdatePrivateRiceOutwardRequest
) {
    const response = await apiClient.put(
        `${BASE_PATH}/${millId}/rice-sales/${id}`,
        data
    )
    return response.data.data
}

export async function deletePrivateRiceOutward(millId: string, id: string) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/rice-sales/${id}`
    )
    return response.data.data
}

export async function bulkDeletePrivateRiceOutward(
    millId: string,
    ids: string[]
) {
    const response = await apiClient.delete(
        `${BASE_PATH}/${millId}/rice-sales/bulk`,
        { data: { ids } }
    )
    return response.data.data
}
