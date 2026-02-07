/**
 * Transporter Report Hooks
 * React Query hooks for Transporter data management (Mill Admin)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { TransporterReportData } from './schema'
import {
    fetchTransporterList,
    createTransporter,
    updateTransporter,
    deleteTransporter,
    bulkDeleteTransporters,
    type TransporterListResponse,
    type TransporterQueryParams,
} from './service'

// Re-export types
export type { TransporterQueryParams, TransporterListResponse }

// ==========================================
// Query Keys
// ==========================================

export const transporterKeys = {
    all: (millId: string) => ['transporter', millId] as const,
    lists: (millId: string) =>
        [...transporterKeys.all(millId), 'list'] as const,
    list: (millId: string, params?: TransporterQueryParams) =>
        [...transporterKeys.lists(millId), params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch transporters list with pagination and filters
 */
export const useTransporterList = (
    millId: string,
    params?: TransporterQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<TransporterListResponse, Error>({
        queryKey: transporterKeys.list(millId, params),
        queryFn: () => fetchTransporterList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new transporter
 */
export const useCreateTransporter = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        TransporterReportData,
        Error,
        Partial<TransporterReportData>
    >({
        mutationFn: (data) => createTransporter(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: transporterKeys.lists(millId),
            })
            toast.success('Transporter created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create transporter')
        },
    })
}

/**
 * Hook to update a transporter
 */
export const useUpdateTransporter = (millId: string, transporterId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        TransporterReportData,
        Error,
        Partial<TransporterReportData>
    >({
        mutationFn: (data) => updateTransporter(millId, transporterId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: transporterKeys.lists(millId),
            })
            toast.success('Transporter updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update transporter')
        },
    })
}

/**
 * Hook to delete a transporter
 */
export const useDeleteTransporter = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (transporterId) => deleteTransporter(millId, transporterId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: transporterKeys.lists(millId),
            })
            toast.success('Transporter deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete transporter')
        },
    })
}

/**
 * Hook to bulk delete transporters
 */
export const useBulkDeleteTransporters = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (transporterIds) =>
            bulkDeleteTransporters(millId, transporterIds),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: transporterKeys.lists(millId),
            })
            toast.success('Transporters deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete transporters')
        },
    })
}
