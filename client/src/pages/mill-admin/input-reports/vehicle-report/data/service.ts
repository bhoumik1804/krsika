import apiClient, { type ApiResponse } from '@/lib/api-client'
import type { VehicleReportData } from './schema'

export interface VehicleListResponse {
    vehicles: VehicleReportData[]
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

export const vehicleService = {
    fetchVehicleList: async (params: {
        millId: string
        page?: number
        limit?: number
        search?: string
        sortBy?: string
        sortOrder?: 'asc' | 'desc'
    }): Promise<VehicleListResponse> => {
        const { millId, ...queryParams } = params
        const response = await apiClient.get<ApiResponse<VehicleListResponse>>(
            `/mills/${millId}/vehicles`,
            { params: queryParams }
        )
        return response.data.data
    },

    createVehicle: async (
        millId: string,
        data: Partial<VehicleReportData>
    ): Promise<VehicleReportData> => {
        const response = await apiClient.post<
            ApiResponse<{ vehicle: VehicleReportData }>
        >(`/mills/${millId}/vehicles`, data)
        return response.data.data.vehicle
    },

    updateVehicle: async (
        millId: string,
        vehicleId: string,
        data: Partial<VehicleReportData>
    ): Promise<VehicleReportData> => {
        const response = await apiClient.put<
            ApiResponse<{ vehicle: VehicleReportData }>
        >(`/mills/${millId}/vehicles/${vehicleId}`, data)
        return response.data.data.vehicle
    },

    deleteVehicle: async (millId: string, vehicleId: string): Promise<void> => {
        await apiClient.delete(`/mills/${millId}/vehicles/${vehicleId}`)
    },

    bulkDeleteVehicles: async (
        millId: string,
        vehicleIds: string[]
    ): Promise<void> => {
        await apiClient.delete(`/mills/${millId}/vehicles/bulk`, {
            data: { ids: vehicleIds },
        })
    },
}
