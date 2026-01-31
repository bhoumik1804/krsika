/**
 * Vehicle Report Service
 * API client for Vehicle CRUD operations
 * Uses centralized axios instance with cookie-based auth
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type {
    VehicleResponse,
    VehicleListResponse,
    VehicleSummaryResponse,
    CreateVehicleRequest,
    UpdateVehicleRequest,
    VehicleQueryParams,
} from './types'

// ==========================================
// API Endpoints
// ==========================================

const VEHICLE_ENDPOINT = (millId: string) => `/mills/${millId}/vehicles`

// ==========================================
// Vehicle API Functions
// ==========================================

/**
 * Fetch all vehicles with pagination and filters
 */
export const fetchVehicleList = async (
    millId: string,
    params?: VehicleQueryParams
): Promise<VehicleListResponse> => {
    const response = await apiClient.get<ApiResponse<VehicleListResponse>>(
        VEHICLE_ENDPOINT(millId),
        { params }
    )
    return response.data.data
}

/**
 * Fetch a single vehicle by ID
 */
export const fetchVehicleById = async (
    millId: string,
    id: string
): Promise<VehicleResponse> => {
    const response = await apiClient.get<ApiResponse<VehicleResponse>>(
        `${VEHICLE_ENDPOINT(millId)}/${id}`
    )
    return response.data.data
}

/**
 * Fetch vehicle summary/statistics
 */
export const fetchVehicleSummary = async (
    millId: string
): Promise<VehicleSummaryResponse> => {
    const response = await apiClient.get<ApiResponse<VehicleSummaryResponse>>(
        `${VEHICLE_ENDPOINT(millId)}/summary`
    )
    return response.data.data
}

/**
 * Create a new vehicle
 */
export const createVehicle = async (
    millId: string,
    data: CreateVehicleRequest
): Promise<VehicleResponse> => {
    const response = await apiClient.post<ApiResponse<VehicleResponse>>(
        VEHICLE_ENDPOINT(millId),
        data
    )
    return response.data.data
}

/**
 * Update an existing vehicle
 */
export const updateVehicle = async (
    millId: string,
    { id, ...data }: UpdateVehicleRequest
): Promise<VehicleResponse> => {
    const response = await apiClient.put<ApiResponse<VehicleResponse>>(
        `${VEHICLE_ENDPOINT(millId)}/${id}`,
        data
    )
    return response.data.data
}

/**
 * Delete a vehicle
 */
export const deleteVehicle = async (
    millId: string,
    id: string
): Promise<void> => {
    await apiClient.delete(`${VEHICLE_ENDPOINT(millId)}/${id}`)
}

/**
 * Bulk delete vehicles
 */
export const bulkDeleteVehicle = async (
    millId: string,
    ids: string[]
): Promise<void> => {
    await apiClient.delete(`${VEHICLE_ENDPOINT(millId)}/bulk`, {
        data: { ids },
    })
}

/**
 * Export vehicles to CSV/Excel
 */
export const exportVehicle = async (
    millId: string,
    params?: VehicleQueryParams,
    format: 'csv' | 'xlsx' = 'csv'
): Promise<Blob> => {
    const response = await apiClient.get(`${VEHICLE_ENDPOINT(millId)}/export`, {
        params: { ...params, format },
        responseType: 'blob',
    })
    return response.data
}
