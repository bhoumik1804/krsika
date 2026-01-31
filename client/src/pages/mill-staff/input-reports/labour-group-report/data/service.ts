/**
 * Labour Group Report Service
 * API client for Labour Group CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    LabourGroupResponse,
    LabourGroupListResponse,
    LabourGroupSummaryResponse,
    CreateLabourGroupRequest,
    UpdateLabourGroupRequest,
    LabourGroupQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const LABOUR_GROUP_ENDPOINT = (millId: string) =>
    `/mills/${millId}/labour-groups`

// ==========================================
// Labour Group API Functions
// ==========================================

/**
 * Fetch all labour groups with pagination and filters
 */
export const fetchLabourGroupList = async (
    millId: string,
    params?: LabourGroupQueryParams
): Promise<LabourGroupListResponse> => {
    const response = await apiClient.get<ApiResponse<LabourGroupListResponse>>(
        LABOUR_GROUP_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single labour group by ID
 */
export const fetchLabourGroupById = async (
    millId: string,
    id: string
): Promise<LabourGroupResponse> => {
    const response = await apiClient.get<ApiResponse<LabourGroupResponse>>(
        `${LABOUR_GROUP_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch labour group summary/statistics
 */
export const fetchLabourGroupSummary = async (
    millId: string
): Promise<LabourGroupSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<LabourGroupSummaryResponse>
    >(`${LABOUR_GROUP_ENDPOINT(millId)}/summary`)
    return response.data.data
}

/**
 * Create a new labour group
 */
export const createLabourGroup = async (
    millId: string,
    data: CreateLabourGroupRequest
): Promise<LabourGroupResponse> => {
    const response = await apiClient.post<ApiResponse<LabourGroupResponse>>(
        LABOUR_GROUP_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing labour group
 */
export const updateLabourGroup = async (
    millId: string,
    { id, ...data }: UpdateLabourGroupRequest
): Promise<LabourGroupResponse> => {
    const response = await apiClient.put<ApiResponse<LabourGroupResponse>>(
        `${LABOUR_GROUP_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a labour group
 */
export const deleteLabourGroup = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${LABOUR_GROUP_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete labour groups
 */
export const bulkDeleteLabourGroup = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${LABOUR_GROUP_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export labour groups to CSV/Excel
 */
export const exportLabourGroup = async (
    millId: string,
    params?: LabourGroupQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${LABOUR_GROUP_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
