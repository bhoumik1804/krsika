/**
 * Labour Inward Service
 * API client for Labour Inward CRUD operations
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    LabourInwardResponse,
    LabourInwardListResponse,
    LabourInwardSummaryResponse,
    CreateLabourInwardRequest,
    UpdateLabourInwardRequest,
    LabourInwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const LABOUR_INWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/labour-inward`

// ==========================================
// Labour Inward API Functions
// ==========================================

/**
 * Fetch all labour inward entries with pagination and filters
 */
export const fetchLabourInwardList = async (
    millId: string,
    params?: LabourInwardQueryParams
): Promise<LabourInwardListResponse> => {
    const response = await apiClient.get<ApiResponse<LabourInwardListResponse>>(
        LABOUR_INWARD_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single labour inward entry by ID
 */
export const fetchLabourInwardById = async (
    millId: string,
    id: string
): Promise<LabourInwardResponse> => {
    const response = await apiClient.get<ApiResponse<LabourInwardResponse>>(
        `${LABOUR_INWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch labour inward summary/statistics
 */
export const fetchLabourInwardSummary = async (
    millId: string,
    params?: Pick<LabourInwardQueryParams, 'startDate' | 'endDate'>
): Promise<LabourInwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<LabourInwardSummaryResponse>
    >(`${LABOUR_INWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new labour inward entry
 */
export const createLabourInward = async (
    millId: string,
    data: CreateLabourInwardRequest
): Promise<LabourInwardResponse> => {
    const response = await apiClient.post<ApiResponse<LabourInwardResponse>>(
        LABOUR_INWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing labour inward entry
 */
export const updateLabourInward = async (
    millId: string,
    { id, ...data }: UpdateLabourInwardRequest
): Promise<LabourInwardResponse> => {
    const response = await apiClient.put<ApiResponse<LabourInwardResponse>>(
        `${LABOUR_INWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a labour inward entry
 */
export const deleteLabourInward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${LABOUR_INWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete labour inward entries
 */
export const bulkDeleteLabourInward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${LABOUR_INWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}
