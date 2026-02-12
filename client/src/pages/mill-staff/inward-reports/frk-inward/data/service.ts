import apiClient, { type ApiResponse } from '@/lib/api-client'
import { frkInwardSchema, type FrkInward } from './schema'
import type {
    CreateFrkInwardRequest,
    FrkInwardListResponse,
    FrkInwardQueryParams,
    FrkInwardSummaryResponse,
    UpdateFrkInwardRequest,
} from './types'

const BASE_PATH = (millId: string) => `/mills/${millId}/frk-inward`

/**
 * Fetch paginated list of frk inward entries
 */
export async function fetchFrkInwardList(
    millId: string,
    params: FrkInwardQueryParams = {}
): Promise<FrkInwardListResponse> {
    const response = await apiClient.get<ApiResponse<FrkInwardListResponse>>(
        BASE_PATH(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch frk inward summary
 */
export async function fetchFrkInwardSummary(
    millId: string,
    params: Pick<FrkInwardQueryParams, 'startDate' | 'endDate'> = {}
): Promise<FrkInwardSummaryResponse> {
    const response = await apiClient.get<
        ApiResponse<{ summary: FrkInwardSummaryResponse }>
    >(`${BASE_PATH(millId)}/summary`, { params })
    return response.data.data.summary
}

/**
 * Create a new frk inward entry
 */
export async function createFrkInward(
    millId: string,
    data: CreateFrkInwardRequest
): Promise<FrkInward> {
    frkInwardSchema.parse(data)

    const response = await apiClient.post<ApiResponse<{ entry: FrkInward }>>(
        BASE_PATH(millId),
        data
    )
    return response.data.data.entry
}

/**
 * Update an existing frk inward entry
 */
export async function updateFrkInward(
    millId: string,
    id: string,
    data: UpdateFrkInwardRequest
): Promise<FrkInward> {
    frkInwardSchema.parse(data)

    const response = await apiClient.put<ApiResponse<{ entry: FrkInward }>>(
        `${BASE_PATH(millId)}/${id}`,
        data
    )
    return response.data.data.entry
}

/**
 * Delete a frk inward entry
 */
export async function deleteFrkInward(
    millId: string,
    id: string
): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`${BASE_PATH(millId)}/${id}`)
}

/**
 * Bulk delete frk inward entries
 */
export async function bulkDeleteFrkInward(
    millId: string,
    ids: string[]
): Promise<void> {
    await apiClient.delete<ApiResponse<{ deletedCount: number }>>(
        `${BASE_PATH(millId)}/bulk`,
        { data: { ids } }
    )
}
