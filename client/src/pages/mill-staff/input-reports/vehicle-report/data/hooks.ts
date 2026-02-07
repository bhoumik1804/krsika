/**
 * Vehicle Report Hooks
 * React Query hooks for Vehicle data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchVehicleList,
    fetchVehicleById,
    fetchVehicleSummary,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    bulkDeleteVehicle,
    exportVehicle,
} from './service'
import type {
    VehicleResponse,
    VehicleListResponse,
    VehicleSummaryResponse,
    // CreateVehicleRequest,
    UpdateVehicleRequest,
    VehicleQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const vehicleKeys = {
    all: ['vehicle'] as const,
    lists: () => [...vehicleKeys.all, 'list'] as const,
    list: (millId: string, params?: VehicleQueryParams) =>
        [...vehicleKeys.lists(), millId, params] as const,
    details: () => [...vehicleKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...vehicleKeys.details(), millId, id] as const,
    summaries: () => [...vehicleKeys.all, 'summary'] as const,
    summary: (millId: string) => [...vehicleKeys.summaries(), millId] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch vehicle list with pagination and filters
 */
export const useVehicleList = (
    millId: string,
    params?: VehicleQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<VehicleListResponse, Error>({
        queryKey: vehicleKeys.list(millId, params),
        queryFn: () => fetchVehicleList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single vehicle
 */
export const useVehicleDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<VehicleResponse, Error>({
        queryKey: vehicleKeys.detail(millId, id),
        queryFn: () => fetchVehicleById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch vehicle summary/statistics
 */
export const useVehicleSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<VehicleSummaryResponse, Error>({
        queryKey: vehicleKeys.summary(millId),
        queryFn: () => fetchVehicleSummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new vehicle
 */
export const useCreateVehicle = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<VehicleResponse, Error, any>({
        mutationFn: (data) => createVehicle(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: vehicleKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: vehicleKeys.summaries(),
            })
            toast.success('Vehicle created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create vehicle')
        },
    })
}

/**
 * Hook to update an existing vehicle
 */
export const useUpdateVehicle = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<VehicleResponse, Error, UpdateVehicleRequest>({
        mutationFn: (data) => updateVehicle(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: vehicleKeys.lists(),
            })
            queryClient.setQueryData(vehicleKeys.detail(millId, data._id), data)
            queryClient.invalidateQueries({
                queryKey: vehicleKeys.summaries(),
            })
            toast.success('Vehicle updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update vehicle')
        },
    })
}

/**
 * Hook to delete a vehicle
 */
export const useDeleteVehicle = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteVehicle(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: vehicleKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: vehicleKeys.summaries(),
            })
            toast.success('Vehicle deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete vehicle')
        },
    })
}

/**
 * Hook to bulk delete vehicles
 */
export const useBulkDeleteVehicle = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteVehicle(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: vehicleKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: vehicleKeys.summaries(),
            })
            toast.success(`${ids.length} vehicles deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete vehicles')
        },
    })
}

/**
 * Hook to export vehicles
 */
export const useExportVehicle = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: VehicleQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportVehicle(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
