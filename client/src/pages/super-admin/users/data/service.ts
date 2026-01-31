/**
 * Users Service
 * API client for Users CRUD operations (Super Admin)
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    UserResponse,
    UserListResponse,
    UserSummaryResponse,
    CreateUserRequest,
    UpdateUserRequest,
    InviteUserRequest,
    UserQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const USERS_ENDPOINT = '/admin/users'

// ==========================================
// Users CRUD API Functions
// ==========================================

/**
 * Fetch all users with pagination and filters
 */
export const fetchUsersList = async (
    params?: UserQueryParams
): Promise<UserListResponse> => {
    const response = await apiClient.get<ApiResponse<UserListResponse>>(
        USERS_ENDPOINT,
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single user by ID
 */
export const fetchUserById = async (id: string): Promise<UserResponse> => {
    const response = await apiClient.get<ApiResponse<UserResponse>>(
        `${USERS_ENDPOINT}/${id}`
    )
    return response.data.data
}

/**
 * Fetch users summary/statistics
 */
export const fetchUsersSummary = async (): Promise<UserSummaryResponse> => {
    const response = await apiClient.get<ApiResponse<UserSummaryResponse>>(
        `${USERS_ENDPOINT}/summary`
    )
    return response.data.data
}

/**
 * Create a new user
 */
export const createUser = async (
    data: CreateUserRequest
): Promise<UserResponse> => {
    const response = await apiClient.post<ApiResponse<UserResponse>>(
        USERS_ENDPOINT,
        data
    )
    return response.data.data
}

/**
 * Update an existing user
 */
export const updateUser = async ({
    id,
    ...data
}: UpdateUserRequest): Promise<UserResponse> => {
    const response = await apiClient.put<ApiResponse<UserResponse>>(
        `${USERS_ENDPOINT}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Invite a user via email
 */
export const inviteUser = async (
    data: InviteUserRequest
): Promise<UserResponse> => {
    const response = await apiClient.post<ApiResponse<UserResponse>>(
        `${USERS_ENDPOINT}/invite`,
        data
    )
    return response.data.data
}

/**
 * Suspend a user
 */
export const suspendUser = async (id: string): Promise<UserResponse> => {
    const response = await apiClient.patch<ApiResponse<UserResponse>>(
        `${USERS_ENDPOINT}/${id}/suspend`
    )
    return response.data.data
}

/**
 * Reactivate a suspended user
 */
export const reactivateUser = async (id: string): Promise<UserResponse> => {
    const response = await apiClient.patch<ApiResponse<UserResponse>>(
        `${USERS_ENDPOINT}/${id}/reactivate`
    )
    return response.data.data
}

/**
 * Delete a user
 */
export const deleteUser = async (id: string): Promise<void> => {
    await apiClient.delete(`${USERS_ENDPOINT}/${id}`)
}

/**
 * Bulk delete users
 */
export const bulkDeleteUsers = async (ids: string[]): Promise<void> => {
    await apiClient.delete(`${USERS_ENDPOINT}/bulk`, {
        data: { ids },
    })
}

/**
 * Export users list to CSV/Excel
 */
export const exportUsers = async (
    params?: UserQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(`${USERS_ENDPOINT}/export`, {
        params: { ...params, format },
        responseType: 'blob',
    })
    return response.data
}
