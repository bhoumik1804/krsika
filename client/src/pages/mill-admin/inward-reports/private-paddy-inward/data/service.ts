import apiClient, { type ApiResponse } from '@/lib/api-client'
import { privatePaddyInwardSchema } from './schema'
import type {
    CreatePrivatePaddyInwardRequest,
    PrivatePaddyInward,
    PrivatePaddyInwardListResponse,
    PrivatePaddyInwardQueryParams,
    PrivatePaddyInwardSummaryResponse,
    UpdatePrivatePaddyInwardRequest,
} from './types'

const BASE_PATH = (millId: string) => `/mills/${millId}/private-paddy-inward`

/**
 * Fetch paginated list of private paddy inward entries
 */
export async function fetchPrivatePaddyInwardList(
    millId: string,
    params: PrivatePaddyInwardQueryParams = {}
): Promise<PrivatePaddyInwardListResponse> {
    const response = await apiClient.get<
        ApiResponse<PrivatePaddyInwardListResponse>
    >(BASE_PATH(millId), { params })
    return response.data.data
}

/**
 * Fetch private paddy inward summary
 */
export async function fetchPrivatePaddyInwardSummary(
    millId: string,
    params: Pick<PrivatePaddyInwardQueryParams, 'startDate' | 'endDate'> = {}
): Promise<PrivatePaddyInwardSummaryResponse> {
    const response = await apiClient.get<
        ApiResponse<{ summary: PrivatePaddyInwardSummaryResponse }>
    >(`${BASE_PATH(millId)}/summary`, { params })
    return response.data.data.summary
}

/**
 * Create a new private paddy inward entry
 */
export async function createPrivatePaddyInward(
    millId: string,
    data: CreatePrivatePaddyInwardRequest
): Promise<PrivatePaddyInward> {
    privatePaddyInwardSchema.parse(data)

    const response = await apiClient.post<ApiResponse<{ entry: PrivatePaddyInward }>>(
        BASE_PATH(millId),
        data
    )
    return response.data.data.entry
}

/**
 * Update an existing private paddy inward entry
 */
export async function updatePrivatePaddyInward(
    millId: string,
    id: string,
    data: UpdatePrivatePaddyInwardRequest
): Promise<PrivatePaddyInward> {
    privatePaddyInwardSchema.parse(data)

    const response = await apiClient.put<ApiResponse<{ entry: PrivatePaddyInward }>>(
        `${BASE_PATH(millId)}/${id}`,
        data
    )
    return response.data.data.entry
}

/**
 * Delete a private paddy inward entry
 */
export async function deletePrivatePaddyInward(
    millId: string,
    id: string
): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`${BASE_PATH(millId)}/${id}`)
}

/**
 * Bulk delete private paddy inward entries
 */
export async function bulkDeletePrivatePaddyInward(
    millId: string,
    ids: string[]
): Promise<void> {
    await apiClient.delete<ApiResponse<{ deletedCount: number }>>(
        `${BASE_PATH(millId)}/bulk`,
        { data: { ids } }
    )
}
