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
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const DO_REPORT_ENDPOINT = (millId: string) => `/mills/${millId}/do-reports`

// ==========================================
// Types
// ==========================================

interface FetchDoReportListParams {
    millId: string
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// DO Report API Functions
// ==========================================

/**
 * Fetch all DO reports with pagination and filters
 */
export const fetchDoReportList = async (
    params: FetchDoReportListParams
): Promise<DoReportListResponse> => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.search) queryParams.append('search', params.search)
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

    const response = await apiClient.get<ApiResponse<DoReportListResponse>>(
        `${DO_REPORT_ENDPOINT(params.millId)}?${queryParams.toString()}`
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
 * Bulk create DO reports
 */
export const bulkCreateDoReport = async (
    millId: string,
    data: CreateDoReportRequest[]
): Promise<{ reports: DoReportResponse[]; count: number }> => {
    const response = await apiClient.post<
        ApiResponse<{ reports: DoReportResponse[]; count: number }>
    >(`${DO_REPORT_ENDPOINT(millId)}/bulk`, data)
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
interface ExportDoReportParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export const exportDoReport = async (
    millId: string,
    params?: ExportDoReportParams,
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
