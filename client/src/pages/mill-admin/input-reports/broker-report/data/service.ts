/**
 * Broker Report Service
 * API client for Broker Report operations (Mill Admin)
 */
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type { BrokerReportData } from './schema'

// ==========================================
// Types
// ==========================================

export interface BrokerListResponse {
    brokers: BrokerReportData[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

export interface BrokerQueryParams {
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
 * Fetch brokers list for a specific mill with pagination and filters
 */
export const fetchBrokerList = async (
    millId: string,
    params?: BrokerQueryParams
): Promise<BrokerListResponse> => {
    const response = await apiClient.get<
        ApiResponse<{ brokers: BrokerReportData[]; pagination: any }>
    >(`/mills/${millId}/brokers`, { params })
    return response.data.data
}

/**
 * Create a new broker
 */
export const createBroker = async (
    millId: string,
    data: Partial<BrokerReportData>
): Promise<BrokerReportData> => {
    const response = await apiClient.post<
        ApiResponse<{ broker: BrokerReportData }>
    >(`/mills/${millId}/brokers`, data)
    return response.data.data.broker
}

/**
 * Update a broker
 */
export const updateBroker = async (
    millId: string,
    brokerId: string,
    data: Partial<BrokerReportData>
): Promise<BrokerReportData> => {
    const response = await apiClient.put<
        ApiResponse<{ broker: BrokerReportData }>
    >(`/mills/${millId}/brokers/${brokerId}`, data)
    return response.data.data.broker
}

/**
 * Delete a broker
 */
export const deleteBroker = async (
    millId: string,
    brokerId: string
): Promise<void> => {
    await apiClient.delete(`/mills/${millId}/brokers/${brokerId}`)
}

/**
 * Bulk delete brokers
 */
export const bulkDeleteBrokers = async (
    millId: string,
    brokerIds: string[]
): Promise<void> => {
    await apiClient.delete(`/mills/${millId}/brokers/bulk`, {
        data: { ids: brokerIds },
    })
}
