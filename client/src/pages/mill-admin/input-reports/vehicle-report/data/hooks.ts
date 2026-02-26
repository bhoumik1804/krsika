import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { VehicleReportData } from './schema'
import { vehicleService, type VehicleListResponse } from './service'

// Query key factory for vehicles
const vehicleQueryKeys = {
    all: ['vehicles'] as const,
    byMill: (millId: string) => [...vehicleQueryKeys.all, millId] as const,
    list: (millId: string, filters?: Record<string, unknown>) =>
        [...vehicleQueryKeys.byMill(millId), 'list', filters] as const,
}

interface UseVehicleListParams {
    millId: string
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export const useVehicleList = (params: UseVehicleListParams) => {
    return useQuery<VehicleListResponse, Error>({
        queryKey: vehicleQueryKeys.list(params.millId, {
            page: params.page,
            limit: params.limit,
            search: params.search,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
        }),
        queryFn: () => vehicleService.fetchVehicleList(params),
        enabled: !!params.millId,
    })
}

export const useCreateVehicle = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Partial<VehicleReportData>) =>
            vehicleService.createVehicle(millId, data),
        onSuccess: () => {
            toast.success('Vehicle created successfully')
            queryClient.invalidateQueries({
                queryKey: vehicleQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create vehicle'
            toast.error(errorMessage)
        },
    })
}

export const useUpdateVehicle = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            vehicleId,
            data,
        }: {
            vehicleId: string
            data: Partial<VehicleReportData>
        }) => vehicleService.updateVehicle(millId, vehicleId, data),
        onSuccess: () => {
            toast.success('Vehicle updated successfully')
            queryClient.invalidateQueries({
                queryKey: vehicleQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update vehicle'
            toast.error(errorMessage)
        },
    })
}

export const useDeleteVehicle = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vehicleId: string) =>
            vehicleService.deleteVehicle(millId, vehicleId),
        onSuccess: () => {
            toast.success('Vehicle deleted successfully')
            queryClient.invalidateQueries({
                queryKey: vehicleQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete vehicle'
            toast.error(errorMessage)
        },
    })
}

export const useBulkDeleteVehicles = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (vehicleIds: string[]) =>
            vehicleService.bulkDeleteVehicles(millId, vehicleIds),
        onSuccess: () => {
            toast.success('Vehicles deleted successfully')
            queryClient.invalidateQueries({
                queryKey: vehicleQueryKeys.byMill(millId),
            })
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete vehicles'
            toast.error(errorMessage)
        },
    })
}
