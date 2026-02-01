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
    CreateStaffRequest,
    UpdateStaffRequest,
    StaffQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const STAFF_ENDPOINT = (millId: string) => `/mills/${millId}/staff`

// ==========================================
// Staff API Functions
// ==========================================

/**
 * Fetch all staff with pagination and filters
 */
export const fetchStaffList = async (
    millId: string,
    params?: StaffQueryParams
): Promise<StaffListResponse> => {
    const response = await apiClient.get<ApiResponse<StaffResponse[]>>(
        STAFF_ENDPOINT(millId),
        { params }
    )
    // API returns { success, data: [...], pagination: {...} }
    // We need to reshape it to StaffListResponse format
    return {
        data: response.data.data,
        pagination: response.data.pagination!,
    }
}

/**
 * Fetch a single staff by ID
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
): Promise<{ deletedCount: number }> => {
    const response = await apiClient.post<
        ApiResponse<{ deletedCount: number }>
    >(`${STAFF_ENDPOINT(millId)}/bulk-delete`, { ids })
    return response.data.data
}
