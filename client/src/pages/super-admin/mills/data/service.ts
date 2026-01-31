/**
 * Mills Service
 * API client for Mills CRUD operations (Super Admin)
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    MillResponse,
    MillListResponse,
    MillSummaryResponse,
    CreateMillRequest,
    UpdateMillRequest,
    VerifyMillRequest,
    MillQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const MILLS_ENDPOINT = '/admin/mills'

// ==========================================
// Mills CRUD API Functions
// ==========================================

/**
 * Fetch all mills with pagination and filters
 */
export const fetchMillsList = async (
    params?: MillQueryParams
): Promise<MillListResponse> => {
    const response = await apiClient.get<ApiResponse<MillListResponse>>(
        MILLS_ENDPOINT,
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single mill by ID
 */
export const fetchMillById = async (id: string): Promise<MillResponse> => {
    const response = await apiClient.get<ApiResponse<MillResponse>>(
        `${MILLS_ENDPOINT}/${id}`
    )
    return response.data.data
}

/**
 * Fetch mills summary/statistics
 */
export const fetchMillsSummary = async (): Promise<MillSummaryResponse> => {
    const response = await apiClient.get<ApiResponse<MillSummaryResponse>>(
        `${MILLS_ENDPOINT}/summary`
    )
    return response.data.data
}

/**
 * Create a new mill
 */
export const createMill = async (
    data: CreateMillRequest
): Promise<MillResponse> => {
    const response = await apiClient.post<ApiResponse<MillResponse>>(
        MILLS_ENDPOINT,
        data
    )
    return response.data.data
}

/**
 * Update an existing mill
 */
export const updateMill = async ({
    id,
    ...data
}: UpdateMillRequest): Promise<MillResponse> => {
    const response = await apiClient.put<ApiResponse<MillResponse>>(
        `${MILLS_ENDPOINT}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Verify a mill (approve or reject)
 */
export const verifyMill = async ({
    id,
    ...data
}: VerifyMillRequest): Promise<MillResponse> => {
    const response = await apiClient.patch<ApiResponse<MillResponse>>(
        `${MILLS_ENDPOINT}/${id}/verify`,
        data
    )
    return response.data.data
}

/**
 * Suspend a mill
 */
export const suspendMill = async (id: string): Promise<MillResponse> => {
    const response = await apiClient.patch<ApiResponse<MillResponse>>(
        `${MILLS_ENDPOINT}/${id}/suspend`
    )
    return response.data.data
}

/**
 * Reactivate a suspended mill
 */
export const reactivateMill = async (id: string): Promise<MillResponse> => {
    const response = await apiClient.patch<ApiResponse<MillResponse>>(
        `${MILLS_ENDPOINT}/${id}/reactivate`
    )
    return response.data.data
}

/**
 * Delete a mill
 */
export const deleteMill = async (id: string): Promise<void> => {
    await apiClient.delete(`${MILLS_ENDPOINT}/${id}`)
}

/**
 * Bulk delete mills
 */
export const bulkDeleteMills = async (ids: string[]): Promise<void> => {
    await apiClient.delete(`${MILLS_ENDPOINT}/bulk`, {
        data: { ids },
    })
}

/**
 * Export mills list to CSV/Excel
 */
export const exportMills = async (
    params?: MillQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(`${MILLS_ENDPOINT}/export`, {
        params: { ...params, format },
        responseType: 'blob',
    })
    return response.data
}
