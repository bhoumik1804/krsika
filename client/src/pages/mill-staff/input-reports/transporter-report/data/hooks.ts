/**
 * Transporter Report Hooks
 * React Query hooks for Transporter data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchTransporterList,
    fetchTransporterById,
    fetchTransporterSummary,
    createTransporter,
    updateTransporter,
    deleteTransporter,
    bulkDeleteTransporter,
    exportTransporter,
} from './service'
import type {
    TransporterResponse,
    TransporterListResponse,
    TransporterSummaryResponse,
    CreateTransporterRequest,
    UpdateTransporterRequest,
    TransporterQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const transporterKeys = {
    all: ['transporter'] as const,
    lists: () => [...transporterKeys.all, 'list'] as const,
    list: (millId: string, params?: TransporterQueryParams) =>
        [...transporterKeys.lists(), millId, params] as const,
    details: () => [...transporterKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...transporterKeys.details(), millId, id] as const,
    summaries: () => [...transporterKeys.all, 'summary'] as const,
    summary: (millId: string) =>
        [...transporterKeys.summaries(), millId] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch transporter list with pagination and filters
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

/**
 * Hook to fetch a single transporter
 */
export const useTransporterDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<TransporterResponse, Error>({
        queryKey: transporterKeys.detail(millId, id),
        queryFn: () => fetchTransporterById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch transporter summary/statistics
 */
export const useTransporterSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<TransporterSummaryResponse, Error>({
        queryKey: transporterKeys.summary(millId),
        queryFn: () => fetchTransporterSummary(millId),
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

    return useMutation<TransporterResponse, Error, CreateTransporterRequest>({
        mutationFn: (data) => createTransporter(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: transporterKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: transporterKeys.summaries(),
            })
            toast.success('Transporter created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create transporter')
        },
    })
}

/**
 * Hook to update an existing transporter
 */
export const useUpdateTransporter = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<TransporterResponse, Error, UpdateTransporterRequest>({
        mutationFn: (data) => updateTransporter(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: transporterKeys.lists(),
            })
            queryClient.setQueryData(
                transporterKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: transporterKeys.summaries(),
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
        mutationFn: (id) => deleteTransporter(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: transporterKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: transporterKeys.summaries(),
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
export const useBulkDeleteTransporter = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteTransporter(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: transporterKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: transporterKeys.summaries(),
            })
            toast.success(`${ids.length} transporters deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete transporters')
        },
    })
}

/**
 * Hook to export transporters
 */
export const useExportTransporter = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: TransporterQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportTransporter(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
