/**
 * Staff Report Service
 * API client for Staff Report CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    StaffReportResponse,
    StaffReportListResponse,
    StaffReportSummaryResponse,
    CreateStaffReportRequest,
    UpdateStaffReportRequest,
    StaffReportQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const STAFF_REPORT_ENDPOINT = (millId: string) =>
    `/mills/${millId}/staff-reports`

// ==========================================
// Staff Report API Functions
// ==========================================

/**
 * Fetch all staff reports with pagination and filters
 */
export const fetchStaffReportList = async (
    millId: string,
    params?: StaffReportQueryParams
): Promise<StaffReportListResponse> => {
    const response = await apiClient.get<ApiResponse<StaffReportListResponse>>(
        STAFF_REPORT_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single staff report by ID
 */
export const fetchStaffReportById = async (
    millId: string,
    id: string
): Promise<StaffReportResponse> => {
    const response = await apiClient.get<ApiResponse<StaffReportResponse>>(
        `${STAFF_REPORT_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch staff report summary/statistics
 */
export const fetchStaffReportSummary = async (
    millId: string
): Promise<StaffReportSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<StaffReportSummaryResponse>
    >(`${STAFF_REPORT_ENDPOINT(millId)}/summary`)
    return response.data.data
}

/**
 * Create a new staff report
 */
export const createStaffReport = async (
    millId: string,
    data: CreateStaffReportRequest
): Promise<StaffReportResponse> => {
    const response = await apiClient.post<ApiResponse<StaffReportResponse>>(
        STAFF_REPORT_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing staff report
 */
export const updateStaffReport = async (
    millId: string,
    { id, ...data }: UpdateStaffReportRequest
): Promise<StaffReportResponse> => {
    const response = await apiClient.put<ApiResponse<StaffReportResponse>>(
        `${STAFF_REPORT_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a staff report
 */
export const deleteStaffReport = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${STAFF_REPORT_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete staff reports
 */
export const bulkDeleteStaffReport = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${STAFF_REPORT_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export staff reports to CSV/Excel
 */
export const exportStaffReport = async (
    millId: string,
    params?: StaffReportQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(
        `${STAFF_REPORT_ENDPOINT(millId)}/export`,
        {
            params: { ...params, format },
            responseType: 'blob',
        }
    )
    return response.data
}
