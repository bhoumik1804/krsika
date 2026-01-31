/**
 * Committee Report Service
 * API client for Committee CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    CommitteeResponse,
    CommitteeListResponse,
    CommitteeSummaryResponse,
    CreateCommitteeRequest,
    UpdateCommitteeRequest,
    CommitteeQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const COMMITTEE_ENDPOINT = (millId: string) => `/mills/${millId}/committees`

// ==========================================
// Committee API Functions
// ==========================================

/**
 * Fetch all committees with pagination and filters
 */
export const fetchCommitteeList = async (
    millId: string,
    params?: CommitteeQueryParams
): Promise<CommitteeListResponse> => {
    const response = await apiClient.get<ApiResponse<CommitteeListResponse>>(
        COMMITTEE_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single committee by ID
 */
export const fetchCommitteeById = async (
    millId: string,
    id: string
): Promise<CommitteeResponse> => {
    const response = await apiClient.get<ApiResponse<CommitteeResponse>>(
        `${COMMITTEE_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch committee summary/statistics
 */
export const fetchCommitteeSummary = async (
    millId: string
): Promise<CommitteeSummaryResponse> => {
    const response = await apiClient.get<ApiResponse<CommitteeSummaryResponse>>(
        `${COMMITTEE_ENDPOINT(millId)}/summary`
    )
    return response.data.data
}

/**
 * Create a new committee
 */
export const createCommittee = async (
    millId: string,
    data: CreateCommitteeRequest
): Promise<CommitteeResponse> => {
    const response = await apiClient.post<ApiResponse<CommitteeResponse>>(
        COMMITTEE_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing committee
 */
export const updateCommittee = async (
    millId: string,
    { id, ...data }: UpdateCommitteeRequest
): Promise<CommitteeResponse> => {
    const response = await apiClient.put<ApiResponse<CommitteeResponse>>(
        `${COMMITTEE_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a committee
 */
export const deleteCommittee = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${COMMITTEE_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete committees
 */
export const bulkDeleteCommittee = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${COMMITTEE_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export committees to CSV/Excel
 */
export const exportCommittee = async (
    millId: string,
    params?: CommitteeQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${COMMITTEE_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
