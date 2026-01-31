/**
 * Nakkhi Outward Service
 * API client for Nakkhi Outward CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    NakkhiOutwardResponse,
    NakkhiOutwardListResponse,
    NakkhiOutwardSummaryResponse,
    CreateNakkhiOutwardRequest,
    UpdateNakkhiOutwardRequest,
    NakkhiOutwardQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const NAKKHI_OUTWARD_ENDPOINT = (millId: string) =>
    `/mills/${millId}/nakkhi-outward`

// ==========================================
// Nakkhi Outward API Functions
// ==========================================

/**
 * Fetch all nakkhi outward entries with pagination and filters
 */
export const fetchNakkhiOutwardList = async (
    millId: string,
    params?: NakkhiOutwardQueryParams
): Promise<NakkhiOutwardListResponse> => {
    const response = await apiClient.get<
        ApiResponse<NakkhiOutwardListResponse>
    >(NAKKHI_OUTWARD_ENDPOINT(millId), { params })
    return response.data.data
}

/**
 * Fetch a single nakkhi outward entry by ID
 */
export const fetchNakkhiOutwardById = async (
    millId: string,
    id: string
): Promise<NakkhiOutwardResponse> => {
    const response = await apiClient.get<ApiResponse<NakkhiOutwardResponse>>(
        `${NAKKHI_OUTWARD_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch nakkhi outward summary/statistics
 */
export const fetchNakkhiOutwardSummary = async (
    millId: string,
    params?: Pick<NakkhiOutwardQueryParams, 'startDate' | 'endDate'>
): Promise<NakkhiOutwardSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<NakkhiOutwardSummaryResponse>
    >(`${NAKKHI_OUTWARD_ENDPOINT(millId)}/summary`, { params })
    return response.data.data
}

/**
 * Create a new nakkhi outward entry
 */
export const createNakkhiOutward = async (
    millId: string,
    data: CreateNakkhiOutwardRequest
): Promise<NakkhiOutwardResponse> => {
    const response = await apiClient.post<ApiResponse<NakkhiOutwardResponse>>(
        NAKKHI_OUTWARD_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing nakkhi outward entry
 */
export const updateNakkhiOutward = async (
    millId: string,
    { id, ...data }: UpdateNakkhiOutwardRequest
): Promise<NakkhiOutwardResponse> => {
    const response = await apiClient.put<ApiResponse<NakkhiOutwardResponse>>(
        `${NAKKHI_OUTWARD_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a nakkhi outward entry
 */
export const deleteNakkhiOutward = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${NAKKHI_OUTWARD_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete nakkhi outward entries
 */
export const bulkDeleteNakkhiOutward = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${NAKKHI_OUTWARD_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export nakkhi outward entries to CSV/Excel
 */
export const exportNakkhiOutward = async (
    millId: string,
    params?: NakkhiOutwardQueryParams
): Promise<Blob> => {
    const response = await apiClient.get(
        `${NAKKHI_OUTWARD_ENDPOINT(millId)}/export`,
        {
            params,
            responseType: 'blob',
        }
    )
    return response.data
}
