/**
 * Staff Service
 * API client for Staff CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    StaffResponse,
    StaffListResponse,
    StaffSummaryResponse,
    AttendanceSummaryResponse,
    BulkAttendanceSummaryResponse,
    CreateStaffRequest,
    UpdateStaffRequest,
    MarkAttendanceRequest,
    BulkMarkAttendanceRequest,
    StaffQueryParams,
    AttendanceSummaryQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const STAFF_ENDPOINT = (millId: string) => `/mills/${millId}/staff`

// ==========================================
// Staff CRUD API Functions
// ==========================================

/**
 * Fetch all staff members with pagination and filters
 */
export const fetchStaffList = async (
    millId: string,
    params?: StaffQueryParams
): Promise<StaffListResponse> => {
    const response = await apiClient.get<ApiResponse<StaffListResponse>>(
        STAFF_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single staff member by ID
 */
export const fetchStaffById = async (
    millId: string,
    id: string
): Promise<StaffResponse> => {
    const response = await apiClient.get<ApiResponse<StaffResponse>>(
        `${STAFF_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch staff summary/statistics
 */
export const fetchStaffSummary = async (
    millId: string
): Promise<StaffSummaryResponse> => {
    const response = await apiClient.get<ApiResponse<StaffSummaryResponse>>(
        `${STAFF_ENDPOINT(millId)}/summary`
    )
    return response.data.data
}

/**
 * Create a new staff member
 */
export const createStaff = async (
    millId: string,
    data: CreateStaffRequest
): Promise<StaffResponse> => {
    const response = await apiClient.post<ApiResponse<StaffResponse>>(
        STAFF_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing staff member
 */
export const updateStaff = async (
    millId: string,
    { id, ...data }: UpdateStaffRequest
): Promise<StaffResponse> => {
    const response = await apiClient.put<ApiResponse<StaffResponse>>(
        `${STAFF_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a staff member
 */
export const deleteStaff = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${STAFF_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete staff members
 */
export const bulkDeleteStaff = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${STAFF_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

// ==========================================
// Attendance API Functions
// ==========================================

/**
 * Mark attendance for a single staff member
 */
export const markAttendance = async (
    millId: string,
    data: MarkAttendanceRequest
): Promise<StaffResponse> => {
    const response = await apiClient.post<ApiResponse<StaffResponse>>(
        `${STAFF_ENDPOINT(millId)}/${data.staffId}/attendance`,
        { date: data.date, status: data.status }
    )
    return response.data.data
}

/**
 * Bulk mark attendance for multiple staff members
 */
export const bulkMarkAttendance = async (
    millId: string,
    data: BulkMarkAttendanceRequest
): Promise<{ success: number; failed: number }> => {
    const response = await apiClient.post<
        ApiResponse<{ success: number; failed: number }>
    >(`${STAFF_ENDPOINT(millId)}/attendance/bulk`, data)
    return response.data.data
}

/**
 * Get attendance summary for a single staff member
 */
export const fetchAttendanceSummary = async (
    millId: string,
    staffId: string,
    params: AttendanceSummaryQueryParams
): Promise<AttendanceSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<AttendanceSummaryResponse>
    >(`${STAFF_ENDPOINT(millId)}/${staffId}/attendance/summary`, { params })
    return response.data.data
}

/**
 * Get attendance summary for all staff members
 */
export const fetchBulkAttendanceSummary = async (
    millId: string,
    params: AttendanceSummaryQueryParams
): Promise<BulkAttendanceSummaryResponse> => {
    const response = await apiClient.get<
        ApiResponse<BulkAttendanceSummaryResponse>
    >(`${STAFF_ENDPOINT(millId)}/attendance/summary`, { params })
    return response.data.data
}

/**
 * Export staff list to CSV/Excel
 */
export const exportStaff = async (
    millId: string,
    params?: StaffQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(`${STAFF_ENDPOINT(millId)}/export`, {
        params: { ...params, format },
        responseType: 'blob',
    })
    return response.data
}
