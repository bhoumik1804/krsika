import apiClient, { type ApiResponse } from '@/lib/api-client'
import type { TransporterReportData } from './schema'

// ==========================================
// Types
// ==========================================

interface FetchTransporterListParams {
    millId: string
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface TransporterListResponse {
    transporters: TransporterReportData[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasPrevPage: boolean
        hasNextPage: boolean
        prevPage: number | null
        nextPage: number | null
    }
}

// ==========================================
// API Functions
// ==========================================

export const transporterService = {
    fetchTransporterList: async (
        params: FetchTransporterListParams
    ): Promise<TransporterListResponse> => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.limit) queryParams.append('limit', params.limit.toString())
        if (params.search) queryParams.append('search', params.search)
        if (params.sortBy) queryParams.append('sortBy', params.sortBy)
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

        const response = await apiClient.get<
            ApiResponse<TransporterListResponse>
        >(`/mills/${params.millId}/transporters?${queryParams.toString()}`)
        return response.data.data
    },

    createTransporter: async (
        millId: string,
        data: Partial<TransporterReportData>
    ): Promise<TransporterReportData> => {
        const response = await apiClient.post<
            ApiResponse<{ transporter: TransporterReportData }>
        >(`/mills/${millId}/transporters`, data)
        return response.data.data.transporter
    },

    updateTransporter: async (
        millId: string,
        transporterId: string,
        data: Partial<TransporterReportData>
    ): Promise<TransporterReportData> => {
        const response = await apiClient.put<
            ApiResponse<{ transporter: TransporterReportData }>
        >(`/mills/${millId}/transporters/${transporterId}`, data)
        return response.data.data.transporter
    },

    deleteTransporter: async (
        millId: string,
        transporterId: string
    ): Promise<void> => {
        await apiClient.delete(`/mills/${millId}/transporters/${transporterId}`)
    },

    bulkDeleteTransporters: async (
        millId: string,
        transporterIds: string[]
    ): Promise<void> => {
        await apiClient.delete(`/mills/${millId}/transporters/bulk`, {
            data: { ids: transporterIds },
        })
    },
}
