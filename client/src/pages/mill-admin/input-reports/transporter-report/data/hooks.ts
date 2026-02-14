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
        mutationFn: async (data) => {
            const promise = createTransporter(millId, data)
            toast.promise(promise, {
                loading: 'Creating transporter...',
                success: 'Transporter created successfully',
                error: (err) => err.message || 'Failed to create transporter',
            })
            return promise
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: transporterKeys.lists(millId),
            })
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
        mutationFn: async (data) => {
            const promise = updateTransporter(millId, transporterId, data)
            toast.promise(promise, {
                loading: 'Updating transporter...',
                success: 'Transporter updated successfully',
                error: (err) => err.message || 'Failed to update transporter',
            })
            return promise
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: transporterKeys.lists(millId),
            })
        },
    })
}

/**
 * Hook to delete a transporter
 */
export const useDeleteTransporter = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: async (transporterId) => {
            const promise = deleteTransporter(millId, transporterId)
            toast.promise(promise, {
                loading: 'Deleting transporter...',
                success: 'Transporter deleted successfully',
                error: (err) => err.message || 'Failed to delete transporter',
            })
            return promise
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: transporterKeys.lists(millId),
            })
        },
    })
}

/**
 * Hook to bulk delete transporters
 */
export const useBulkDeleteTransporters = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: async (transporterIds) => {
            const promise = bulkDeleteTransporters(millId, transporterIds)
            toast.promise(promise, {
                loading: `Deleting ${transporterIds.length} transporter${transporterIds.length > 1 ? 's' : ''}...`,
                success: `${transporterIds.length} transporter${transporterIds.length > 1 ? 's' : ''} deleted successfully`,
                error: (err) => err.message || 'Failed to delete transporters',
            })
            return promise
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: transporterKeys.lists(millId),
            })
        },
    })
}
