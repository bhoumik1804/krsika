/**
 * FRK Inward Service
 * API client for FRK Inward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    FrkInwardResponse,
    FrkInwardListResponse,
    FrkInwardSummaryResponse,
    CreateFrkInwardRequest,
    UpdateFrkInwardRequest,
    FrkInwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const FRK_INWARD_ENDPOINT = (millId: string) => `/mills/${millId}/frk-inward`

// ==========================================
// FRK Inward API Functions
// ==========================================

/**
 * Fetch all FRK inward entries with pagination and filters
 */
export const fetchFrkInwardList = async (
    millId: string,
    params?: FrkInwardQueryParams
): Promise<FrkInwardListResponse> => {
    const response = await apiClient.get<ApiResponse<FrkInwardListResponse>>(
        FRK_INWARD_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single FRK inward entry by ID
 */
export const fetchFrkInwardById = async (
    millId: string,
    id: string
): Promise<FrkInwardResponse> => {
    const response = await apiClient.get<ApiResponse<FrkInwardResponse>>(
        `${FRK_INWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch FRK inward summary/statistics
 */
export const fetchFrkInwardSummary = async (
    millId: string,
    params?: Pick<FrkInwardQueryParams, 'startDate' | 'endDate'>
): Promise<FrkInwardSummaryResponse> => {
    const response = await apiClient.get<ApiResponse<FrkInwardSummaryResponse>>(
        `${FRK_INWARD_ENDPOINT(millId)}/summary`,
        { params }
    )
    return response.data.data
}

/**
 * Create a new FRK inward entry
 */
export const createFrkInward = async (
    millId: string,
    data: CreateFrkInwardRequest
): Promise<FrkInwardResponse> => {
    const response = await apiClient.post<ApiResponse<FrkInwardResponse>>(
        FRK_INWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing FRK inward entry
 */
export const updateFrkInward = async (
    millId: string,
    { id, ...data }: UpdateFrkInwardRequest
): Promise<FrkInwardResponse> => {
    const response = await apiClient.put<ApiResponse<FrkInwardResponse>>(
        `${FRK_INWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a FRK inward entry
 */
export const deleteFrkInward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${FRK_INWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete FRK inward entries
 */
export const bulkDeleteFrkInward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${FRK_INWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export FRK inward entries to CSV/Excel
 */
export const exportFrkInward = async (
    millId: string,
    params?: FrkInwardQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${FRK_INWARD_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
