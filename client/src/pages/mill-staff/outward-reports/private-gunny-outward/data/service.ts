import { apiClient } from '@/lib/api-client'
import type { PrivateGunnyOutward } from './schema'
import type {
    CreatePrivateGunnyOutwardRequest,
    PrivateGunnyOutwardListResponse,
    PrivateGunnyOutwardQueryParams,
    PrivateGunnyOutwardSummaryResponse,
    UpdatePrivateGunnyOutwardRequest,
} from './types'

const BASE_PATH = '/mills'

export const fetchPrivateGunnyOutwardList = async (
    millId: string,
    params: PrivateGunnyOutwardQueryParams
): Promise<PrivateGunnyOutwardListResponse> => {
    const { data } = await apiClient.get(
        `${BASE_PATH}/${millId}/private-gunny-outward`,
        { params }
    )
    return data.data
}

export const fetchPrivateGunnyOutwardSummary = async (
    millId: string,
    params: Pick<
        PrivateGunnyOutwardQueryParams,
        'startDate' | 'endDate' | 'search'
    >
): Promise<PrivateGunnyOutwardSummaryResponse> => {
    const { data } = await apiClient.get(
        `${BASE_PATH}/${millId}/private-gunny-outward/summary`,
        { params }
    )
    return data.data
}

export const createPrivateGunnyOutward = async (
    millId: string,
    payload: CreatePrivateGunnyOutwardRequest
): Promise<PrivateGunnyOutward> => {
    const { data } = await apiClient.post(
        `${BASE_PATH}/${millId}/private-gunny-outward`,
        payload
    )
    return data.data.entry
}

export const getPrivateGunnyOutwardById = async (
    millId: string,
    id: string
): Promise<PrivateGunnyOutward> => {
    const { data } = await apiClient.get(
        `${BASE_PATH}/${millId}/private-gunny-outward/${id}`
    )
    return data.data.entry
}

export const updatePrivateGunnyOutward = async (
    millId: string,
    id: string,
    payload: UpdatePrivateGunnyOutwardRequest
): Promise<PrivateGunnyOutward> => {
    const { data } = await apiClient.put(
        `${BASE_PATH}/${millId}/private-gunny-outward/${id}`,
        payload
    )
    return data.data.entry
}

export const deletePrivateGunnyOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/private-gunny-outward/${id}`)
}

export const bulkDeletePrivateGunnyOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(
        `${BASE_PATH}/${millId}/private-gunny-outward/bulk`,
        {
            data: { ids },
        }
    )
}
