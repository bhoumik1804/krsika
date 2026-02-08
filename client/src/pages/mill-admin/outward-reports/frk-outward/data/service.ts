import { apiClient } from '@/lib/api-client'
import type { FrkOutward } from './schema'
import type {
    CreateFrkOutwardRequest,
    FrkOutwardListResponse,
    FrkOutwardQueryParams,
    FrkOutwardSummaryResponse,
    UpdateFrkOutwardRequest,
} from './types'

const BASE_PATH = '/mills'

export const fetchFrkOutwardList = async (
    millId: string,
    params: FrkOutwardQueryParams
): Promise<FrkOutwardListResponse> => {
    const { data } = await apiClient.get(`${BASE_PATH}/${millId}/frk-outward`, {
        params,
    })
    return data.data
}

export const fetchFrkOutwardSummary = async (
    millId: string,
    params: Pick<FrkOutwardQueryParams, 'startDate' | 'endDate' | 'partyName'>
): Promise<FrkOutwardSummaryResponse> => {
    const { data } = await apiClient.get(
        `${BASE_PATH}/${millId}/frk-outward/summary`,
        { params }
    )
    return data.data
}

export const createFrkOutward = async (
    millId: string,
    payload: CreateFrkOutwardRequest
): Promise<FrkOutward> => {
    const { data } = await apiClient.post(
        `${BASE_PATH}/${millId}/frk-outward`,
        payload
    )
    return data.data.entry
}

export const getFrkOutwardById = async (
    millId: string,
    id: string
): Promise<FrkOutward> => {
    const { data } = await apiClient.get(
        `${BASE_PATH}/${millId}/frk-outward/${id}`
    )
    return data.data.entry
}

export const updateFrkOutward = async (
    millId: string,
    id: string,
    payload: UpdateFrkOutwardRequest
): Promise<FrkOutward> => {
    const { data } = await apiClient.put(
        `${BASE_PATH}/${millId}/frk-outward/${id}`,
        payload
    )
    return data.data.entry
}

export const deleteFrkOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/frk-outward/${id}`)
}

export const bulkDeleteFrkOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${millId}/frk-outward/bulk`, {
        data: { ids },
    })
}
