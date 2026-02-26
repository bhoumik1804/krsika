import apiClient, { type ApiResponse } from '@/lib/api-client'
import { govtPaddyInwardSchema, type GovtPaddyInward } from './schema'
import type {
    CreateGovtPaddyInwardRequest,
    GovtPaddyInwardListResponse,
    GovtPaddyInwardQueryParams,
    GovtPaddyInwardSummaryResponse,
    UpdateGovtPaddyInwardRequest,
} from './types'

const BASE_PATH = (millId: string) => `/mills/${millId}/govt-paddy-inward`

/**
 * Fetch paginated list of govt paddy inward entries
 */
export async function fetchGovtPaddyInwardList(
    millId: string,
    params: GovtPaddyInwardQueryParams = {}
): Promise<GovtPaddyInwardListResponse> {
    const response = await apiClient.get<
        ApiResponse<GovtPaddyInwardListResponse>
    >(BASE_PATH(millId), { params })
    return response.data.data
}

/**
 * Fetch govt paddy inward summary
 */
export async function fetchGovtPaddyInwardSummary(
    millId: string,
    params: Pick<GovtPaddyInwardQueryParams, 'startDate' | 'endDate'> = {}
): Promise<GovtPaddyInwardSummaryResponse> {
    const response = await apiClient.get<
        ApiResponse<{ summary: GovtPaddyInwardSummaryResponse }>
    >(`${BASE_PATH(millId)}/summary`, { params })
    return response.data.data.summary
}

/**
 * Create a new govt paddy inward entry
 */
export async function createGovtPaddyInward(
    millId: string,
    data: CreateGovtPaddyInwardRequest
): Promise<GovtPaddyInward> {
    govtPaddyInwardSchema.parse(data)

    const response = await apiClient.post<
        ApiResponse<{ entry: GovtPaddyInward }>
    >(BASE_PATH(millId), data)
    return response.data.data.entry
}

/**
 * Update an existing govt paddy inward entry
 */
export async function updateGovtPaddyInward(
    millId: string,
    id: string,
    data: UpdateGovtPaddyInwardRequest
): Promise<GovtPaddyInward> {
    govtPaddyInwardSchema.parse(data)

    const response = await apiClient.put<
        ApiResponse<{ entry: GovtPaddyInward }>
    >(`${BASE_PATH(millId)}/${id}`, data)
    return response.data.data.entry
}

/**
 * Delete a govt paddy inward entry
 */
export async function deleteGovtPaddyInward(
    millId: string,
    id: string
): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`${BASE_PATH(millId)}/${id}`)
}

/**
 * Bulk delete govt paddy inward entries
 */
export async function bulkDeleteGovtPaddyInward(
    millId: string,
    ids: string[]
): Promise<void> {
    await apiClient.delete<ApiResponse<{ deletedCount: number }>>(
        `${BASE_PATH(millId)}/bulk`,
        { data: { ids } }
    )
}
