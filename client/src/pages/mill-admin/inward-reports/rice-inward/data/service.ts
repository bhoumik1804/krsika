import apiClient, { type ApiResponse } from '@/lib/api-client'
import { riceInwardSchema } from './schema'
import type {
    RiceInward,
    RiceInwardListResponse,
    RiceInwardSummaryResponse,
    RiceInwardQueryParams,
    CreateRiceInwardRequest,
    UpdateRiceInwardRequest,
} from './types'

const BASE_PATH = (millId: string) => `/mills/${millId}/rice-inward`

/**
 * Fetch paginated list of rice inward entries
 */
export async function fetchRiceInwardList(
    millId: string,
    params: RiceInwardQueryParams = {}
): Promise<RiceInwardListResponse> {
    const response = await apiClient.get<ApiResponse<RiceInwardListResponse>>(
        BASE_PATH(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch rice inward summary
 */
export async function fetchRiceInwardSummary(
    millId: string
): Promise<RiceInwardSummaryResponse> {
    const response = await apiClient.get<
        ApiResponse<RiceInwardSummaryResponse>
    >(`${BASE_PATH(millId)}/summary`)
    return response.data.data
}

/**
 * Create a new rice inward entry
 */
export async function createRiceInward(
    millId: string,
    data: CreateRiceInwardRequest
): Promise<RiceInward> {
    // Validate data
    riceInwardSchema.parse(data)

    const response = await apiClient.post<ApiResponse<RiceInward>>(
        BASE_PATH(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing rice inward entry
 */
export async function updateRiceInward(
    millId: string,
    id: string,
    data: UpdateRiceInwardRequest
): Promise<RiceInward> {
    // Validate data
    riceInwardSchema.parse(data)

    const response = await apiClient.put<ApiResponse<RiceInward>>(
        `${BASE_PATH(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a rice inward entry
 */
export async function deleteRiceInward(
    millId: string,
    id: string
): Promise<void> {
    await apiClient.delete(`${BASE_PATH(millId)}/${id}`)
}

/**
 * Bulk delete rice inward entries
 */
export async function bulkDeleteRiceInward(
    millId: string,
    ids: string[]
): Promise<void> {
    await apiClient.delete(`${BASE_PATH(millId)}/bulk`, {
        data: { ids },
    })
}
