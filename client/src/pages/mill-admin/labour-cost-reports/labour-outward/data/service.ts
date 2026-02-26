/**
 * Labour Outward Service
 * API client for Labour Outward CRUD operations
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    LabourOutwardResponse,
    LabourOutwardListResponse,
    LabourOutwardSummaryResponse,
    CreateLabourOutwardRequest,
    UpdateLabourOutwardRequest,
    LabourOutwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const LABOUR_OUTWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/labour-outward`

// ==========================================
// Labour Outward API Functions
// ==========================================

/**
 * Fetch all labour outward entries with pagination and filters
 */
export const fetchLabourOutwardList = async (
    millId: string,
    params?: LabourOutwardQueryParams
): Promise<LabourOutwardListResponse> => {
    const response = await apiClient.get<
        ApiResponse<LabourOutwardListResponse>
    >(LABOUR_OUTWARD_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single labour outward entry by ID
 */
export const fetchLabourOutwardById = async (
    millId: string,
    id: string
): Promise<LabourOutwardResponse> => {
    const response = await apiClient.get<ApiResponse<LabourOutwardResponse>>(
        `${LABOUR_OUTWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch labour outward summary/statistics
 */
export const fetchLabourOutwardSummary = async (
    millId: string,
    params?: Pick<LabourOutwardQueryParams, 'startDate' | 'endDate'>
): Promise<LabourOutwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<LabourOutwardSummaryResponse>
    >(`${LABOUR_OUTWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new labour outward entry
 */
export const createLabourOutward = async (
    millId: string,
    data: CreateLabourOutwardRequest
): Promise<LabourOutwardResponse> => {
    const response = await apiClient.post<ApiResponse<LabourOutwardResponse>>(
        LABOUR_OUTWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing labour outward entry
 */
export const updateLabourOutward = async (
    millId: string,
    { id, ...data }: UpdateLabourOutwardRequest
): Promise<LabourOutwardResponse> => {
    const response = await apiClient.put<ApiResponse<LabourOutwardResponse>>(
        `${LABOUR_OUTWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a labour outward entry
 */
export const deleteLabourOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${LABOUR_OUTWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete labour outward entries
 */
export const bulkDeleteLabourOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${LABOUR_OUTWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}
