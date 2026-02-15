import apiClient, { type ApiResponse } from '@/lib/api-client'
import type { StaffReportData } from './schema'

export interface StaffListResponse {
    staff: StaffReportData[]
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

export const staffService = {
    fetchStaffList: async (params: {
        millId: string
        page?: number
        limit?: number
        search?: string
        sortBy?: string
        sortOrder?: 'asc' | 'desc'
    }): Promise<StaffListResponse> => {
        const { millId, ...queryParams } = params
        const response = await apiClient.get<ApiResponse<StaffListResponse>>(
            `/mills/${millId}/staff-reports`,
            { params: queryParams }
        )
        return response.data.data
    },

    createStaff: async (
        millId: string,
        data: Partial<StaffReportData>
    ): Promise<StaffReportData> => {
        const response = await apiClient.post<
            ApiResponse<{ staff: StaffReportData }>
        >(`/mills/${millId}/staff-reports`, data)
        return response.data.data.staff
    },

    updateStaff: async (
        millId: string,
        staffId: string,
        data: Partial<StaffReportData>
    ): Promise<StaffReportData> => {
        const response = await apiClient.put<
            ApiResponse<{ staff: StaffReportData }>
        >(`/mills/${millId}/staff-reports/${staffId}`, data)
        return response.data.data.staff
    },

    deleteStaff: async (millId: string, staffId: string): Promise<void> => {
        await apiClient.delete(`/mills/${millId}/staff-reports/${staffId}`)
    },

    bulkDeleteStaff: async (
        millId: string,
        staffIds: string[]
    ): Promise<void> => {
        await apiClient.delete(`/mills/${millId}/staff-reports/bulk`, {
            data: { ids: staffIds },
        })
    },
}
