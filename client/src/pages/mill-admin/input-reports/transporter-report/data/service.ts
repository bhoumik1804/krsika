/**
 * Transporter Report Service
 * API client for Transporter Report operations (Mill Admin)
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type { TransporterReportData } from './schema'

// ==========================================
// Types
// ==========================================

export interface TransporterListResponse {
    transporters: TransporterReportData[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

export interface TransporterQueryParams {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ==========================================
// API Functions
// ==========================================

/**
 * Fetch transporters list for a specific mill with pagination and filters
 */
export const fetchTransporterList = async (
    millId: string,
    params?: TransporterQueryParams
): Promise<TransporterListResponse> => {
    const response = await apiClient.get<
        ApiResponse<{ transporters: TransporterReportData[]; pagination: any }>
    >(`/mills/${millId}/transporters`, { params })
    return response.data.data
}

/**
 * Create a new transporter
 */
export const createTransporter = async (
    millId: string,
    data: Partial<TransporterReportData>
): Promise<TransporterReportData> => {
    const response = await apiClient.post<
        ApiResponse<{ transporter: TransporterReportData }>
    >(`/mills/${millId}/transporters`, data)
    return response.data.data.transporter
}

/**
 * Update a transporter
 */
export const updateTransporter = async (
    millId: string,
    transporterId: string,
    data: Partial<TransporterReportData>
): Promise<TransporterReportData> => {
    const response = await apiClient.put<
        ApiResponse<{ transporter: TransporterReportData }>
    >(`/mills/${millId}/transporters/${transporterId}`, data)
    return response.data.data.transporter
}

/**
 * Delete a transporter
 */
export const deleteTransporter = async (
    millId: string,
    transporterId: string
): Promise<void> => {
    await apiClient.delete(`/mills/${millId}/transporters/${transporterId}`)
}

/**
 * Bulk delete transporters
 */
export const bulkDeleteTransporters = async (
    millId: string,
    transporterIds: string[]
): Promise<void> => {
    await apiClient.delete(`/mills/${millId}/transporters/bulk`, {
        data: { ids: transporterIds },
    })
}
