import apiClient, { type ApiResponse } from '@/lib/api-client'
import { gunnyInwardSchema, type GunnyInward } from './schema'
import type {
    GunnyInwardListResponse,
    GunnyInwardSummaryResponse,
    GunnyInwardQueryParams,
    CreateGunnyInwardRequest,
    UpdateGunnyInwardRequest,
} from './types'

const BASE_PATH = (millId: string) => `/mills/${millId}/gunny-inward`

/**
 * Fetch paginated list of gunny inward entries
 */
export async function fetchGunnyInwardList(
    millId: string,
    params: GunnyInwardQueryParams = {}
): Promise<GunnyInwardListResponse> {
    const response = await apiClient.get<ApiResponse<GunnyInwardListResponse>>(
        BASE_PATH(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch gunny inward summary
 */
export async function fetchGunnyInwardSummary(
    millId: string
): Promise<GunnyInwardSummaryResponse> {
    const response = await apiClient.get<
        ApiResponse<{ summary: GunnyInwardSummaryResponse }>
    >(`${BASE_PATH(millId)}/summary`)
    return response.data.data.summary
}

/**
 * Create a new gunny inward entry
 */
export async function createGunnyInward(
    millId: string,
    data: CreateGunnyInwardRequest
): Promise<GunnyInward> {
    // Validate data
    gunnyInwardSchema.parse(data)

    const response = await apiClient.post<ApiResponse<{ entry: GunnyInward }>>(
        BASE_PATH(millId),
        data
    )
    return response.data.data.entry
}

/**
 * Update an existing gunny inward entry
 */
export async function updateGunnyInward(
    millId: string,
    id: string,
    data: UpdateGunnyInwardRequest
): Promise<GunnyInward> {
    // Validate data
    gunnyInwardSchema.parse(data)

    const response = await apiClient.put<ApiResponse<{ entry: GunnyInward }>>(
        `${BASE_PATH(millId)}/${id}`,
        data
    )
    return response.data.data.entry
}

/**
 * Delete a gunny inward entry
 */
export async function deleteGunnyInward(
    millId: string,
    id: string
): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`${BASE_PATH(millId)}/${id}`)
}

/**
 * Bulk delete gunny inward entries
 */
export async function bulkDeleteGunnyInward(
    millId: string,
    ids: string[]
): Promise<void> {
    await apiClient.delete<ApiResponse<{ deletedCount: number }>>(
        `${BASE_PATH(millId)}/bulk`,
        { data: { ids } }
    )
}
