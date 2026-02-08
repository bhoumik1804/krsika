import apiClient, { type ApiResponse } from '@/lib/api-client'
import { privatePaddyOutwardSchema, type PrivatePaddyOutward } from './schema'
import type {
    CreatePrivatePaddyOutwardRequest,
    PrivatePaddyOutwardListResponse,
    PrivatePaddyOutwardQueryParams,
    PrivatePaddyOutwardSummaryResponse,
    UpdatePrivatePaddyOutwardRequest,
} from './types'

const BASE_PATH = (millId: string) => `/mills/${millId}/private-paddy-outward`

/**
 * Fetch paginated list of private paddy outward entries
 */
export async function fetchPrivatePaddyOutwardList(
    millId: string,
    params: PrivatePaddyOutwardQueryParams = {}
): Promise<PrivatePaddyOutwardListResponse> {
    const response = await apiClient.get<
        ApiResponse<PrivatePaddyOutwardListResponse>
    >(BASE_PATH(millId), { params })
    return response.data.data
}

/**
 * Fetch private paddy outward summary
 */
export async function fetchPrivatePaddyOutwardSummary(
    millId: string,
    params: Pick<PrivatePaddyOutwardQueryParams, 'startDate' | 'endDate'> = {}
): Promise<PrivatePaddyOutwardSummaryResponse> {
    const response = await apiClient.get<
        ApiResponse<{ summary: PrivatePaddyOutwardSummaryResponse }>
    >(`${BASE_PATH(millId)}/summary`, { params })
    return response.data.data.summary
}

/**
 * Create a new private paddy outward entry
 */
export async function createPrivatePaddyOutward(
    millId: string,
    data: CreatePrivatePaddyOutwardRequest
): Promise<PrivatePaddyOutward> {
    privatePaddyOutwardSchema.parse(data)

    const response = await apiClient.post<
        ApiResponse<{ entry: PrivatePaddyOutward }>
    >(BASE_PATH(millId), data)
    return response.data.data.entry
}

/**
 * Update an existing private paddy outward entry
 */
export async function updatePrivatePaddyOutward(
    millId: string,
    id: string,
    data: UpdatePrivatePaddyOutwardRequest
): Promise<PrivatePaddyOutward> {
    privatePaddyOutwardSchema.parse(data)

    const response = await apiClient.put<
        ApiResponse<{ entry: PrivatePaddyOutward }>
    >(`${BASE_PATH(millId)}/${id}`, data)
    return response.data.data.entry
}

/**
 * Delete a private paddy outward entry
 */
export async function deletePrivatePaddyOutward(
    millId: string,
    id: string
): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`${BASE_PATH(millId)}/${id}`)
}

/**
 * Bulk delete private paddy outward entries
 */
export async function bulkDeletePrivatePaddyOutward(
    millId: string,
    ids: string[]
): Promise<void> {
    await apiClient.delete<ApiResponse<{ deletedCount: number }>>(
        `${BASE_PATH(millId)}/bulk`,
        { data: { ids } }
    )
}
