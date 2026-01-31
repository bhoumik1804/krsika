/**
 * DO Report Service
 * API client for DO Report CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    DoReportResponse,
    DoReportListResponse,
    DoReportSummaryResponse,
    CreateDoReportRequest,
    UpdateDoReportRequest,
    DoReportQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const DO_REPORT_ENDPOINT = (millId: string) => `/mills/${millId}/do-reports`

// ==========================================
// DO Report API Functions
// ==========================================

/**
 * Fetch all DO reports with pagination and filters
 */
export const fetchDoReportList = async (
    millId: string,
    params?: DoReportQueryParams
): Promise<DoReportListResponse> => {
    const response = await apiClient.get<ApiResponse<DoReportListResponse>>(
        DO_REPORT_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single DO report by ID
 */
export const fetchDoReportById = async (
    millId: string,
    id: string
): Promise<DoReportResponse> => {
    const response = await apiClient.get<ApiResponse<DoReportResponse>>(
        `${DO_REPORT_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch DO report summary/statistics
 */
export const fetchDoReportSummary = async (
    millId: string
): Promise<DoReportSummaryResponse> => {
    const response = await apiClient.get<ApiResponse<DoReportSummaryResponse>>(
        `${DO_REPORT_ENDPOINT(millId)}/summary`
    )
    return response.data.data
}

/**
 * Create a new DO report
 */
export const createDoReport = async (
    millId: string,
    data: CreateDoReportRequest
): Promise<DoReportResponse> => {
    const response = await apiClient.post<ApiResponse<DoReportResponse>>(
        DO_REPORT_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing DO report
 */
export const updateDoReport = async (
    millId: string,
    { id, ...data }: UpdateDoReportRequest
): Promise<DoReportResponse> => {
    const response = await apiClient.put<ApiResponse<DoReportResponse>>(
        `${DO_REPORT_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a DO report
 */
export const deleteDoReport = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${DO_REPORT_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete DO reports
 */
export const bulkDeleteDoReport = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${DO_REPORT_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export DO reports to CSV/Excel
 */
export const exportDoReport = async (
    millId: string,
    params?: DoReportQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${DO_REPORT_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
