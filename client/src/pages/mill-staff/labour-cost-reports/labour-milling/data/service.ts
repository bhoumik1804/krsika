/**
 * Labour Milling Service
 * API client for Labour Milling CRUD operations
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    LabourMillingResponse,
    LabourMillingListResponse,
    LabourMillingSummaryResponse,
    CreateLabourMillingRequest,
    UpdateLabourMillingRequest,
    LabourMillingQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const LABOUR_MILLING_ENDPOINT = (millId: string) =>
    `/mills/${millId}/labour-milling`

// ==========================================
// Labour Milling API Functions
// ==========================================

/**
 * Fetch all labour milling entries with pagination and filters
 */
export const fetchLabourMillingList = async (
    millId: string,
    params?: LabourMillingQueryParams
): Promise<LabourMillingListResponse> => {
    const response = await apiClient.get<
        ApiResponse<LabourMillingListResponse>
    >(LABOUR_MILLING_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single labour milling entry by ID
 */
export const fetchLabourMillingById = async (
    millId: string,
    id: string
): Promise<LabourMillingResponse> => {
    const response = await apiClient.get<ApiResponse<LabourMillingResponse>>(
        `${LABOUR_MILLING_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch labour milling summary/statistics
 */
export const fetchLabourMillingSummary = async (
    millId: string,
    params?: Pick<LabourMillingQueryParams, 'startDate' | 'endDate'>
): Promise<LabourMillingSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<LabourMillingSummaryResponse>
    >(`${LABOUR_MILLING_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new labour milling entry
 */
export const createLabourMilling = async (
    millId: string,
    data: CreateLabourMillingRequest
): Promise<LabourMillingResponse> => {
    const response = await apiClient.post<ApiResponse<LabourMillingResponse>>(
        LABOUR_MILLING_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing labour milling entry
 */
export const updateLabourMilling = async (
    millId: string,
    { id, ...data }: UpdateLabourMillingRequest
): Promise<LabourMillingResponse> => {
    const response = await apiClient.put<ApiResponse<LabourMillingResponse>>(
        `${LABOUR_MILLING_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a labour milling entry
 */
export const deleteLabourMilling = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${LABOUR_MILLING_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete labour milling entries
 */
export const bulkDeleteLabourMilling = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${LABOUR_MILLING_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}
