/**
 * Transporter Report Service
 * API client for Transporter CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    TransporterResponse,
    TransporterListResponse,
    TransporterSummaryResponse,
    CreateTransporterRequest,
    UpdateTransporterRequest,
    TransporterQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const TRANSPORTER_ENDPOINT = (millId: string) => `/mills/${millId}/transporters`

// ==========================================
// Transporter API Functions
// ==========================================

/**
 * Fetch all transporters with pagination and filters
 */
export const fetchTransporterList = async (
    millId: string,
    params?: TransporterQueryParams
): Promise<TransporterListResponse> => {
    const response = await apiClient.get<ApiResponse<TransporterListResponse>>(
        TRANSPORTER_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single transporter by ID
 */
export const fetchTransporterById = async (
    millId: string,
    id: string
): Promise<TransporterResponse> => {
    const response = await apiClient.get<ApiResponse<TransporterResponse>>(
        `${TRANSPORTER_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch transporter summary/statistics
 */
export const fetchTransporterSummary = async (
    millId: string
): Promise<TransporterSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<TransporterSummaryResponse>
    >(`${TRANSPORTER_ENDPOINT(millId)}/summary`)
    return response.data.data
}

/**
 * Create a new transporter
 */
export const createTransporter = async (
    millId: string,
    data: CreateTransporterRequest
): Promise<TransporterResponse> => {
    const response = await apiClient.post<ApiResponse<TransporterResponse>>(
        TRANSPORTER_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing transporter
 */
export const updateTransporter = async (
    millId: string,
    { id, ...data }: UpdateTransporterRequest
): Promise<TransporterResponse> => {
    const response = await apiClient.put<ApiResponse<TransporterResponse>>(
        `${TRANSPORTER_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a transporter
 */
export const deleteTransporter = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${TRANSPORTER_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete transporters
 */
export const bulkDeleteTransporter = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${TRANSPORTER_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export transporters to CSV/Excel
 */
export const exportTransporter = async (
    millId: string,
    params?: TransporterQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${TRANSPORTER_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
