/**
 * Outward Balance Lifting Rice Hooks
 * React Query hooks for Outward Balance Lifting Rice data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchOutwardBalanceLiftingRiceList,
    fetchOutwardBalanceLiftingRiceById,
    fetchOutwardBalanceLiftingRiceSummary,
    createOutwardBalanceLiftingRice,
    updateOutwardBalanceLiftingRice,
    deleteOutwardBalanceLiftingRice,
    bulkDeleteOutwardBalanceLiftingRice,
    exportOutwardBalanceLiftingRice,
} from './service'
import type {
    OutwardBalanceLiftingRiceResponse,
    OutwardBalanceLiftingRiceListResponse,
    OutwardBalanceLiftingRiceSummaryResponse,
    CreateOutwardBalanceLiftingRiceRequest,
    UpdateOutwardBalanceLiftingRiceRequest,
    OutwardBalanceLiftingRiceQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const outwardBalanceLiftingRiceKeys = {
    all: ['outward-balance-lifting-rice'] as const,
    lists: () => [...outwardBalanceLiftingRiceKeys.all, 'list'] as const,
    list: (millId: string, params?: OutwardBalanceLiftingRiceQueryParams) =>
        [...outwardBalanceLiftingRiceKeys.lists(), millId, params] as const,
    details: () => [...outwardBalanceLiftingRiceKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...outwardBalanceLiftingRiceKeys.details(), millId, id] as const,
    summaries: () => [...outwardBalanceLiftingRiceKeys.all, 'summary'] as const,
    summary: (millId: string) =>
        [...outwardBalanceLiftingRiceKeys.summaries(), millId] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch outward balance lifting rice list with pagination and filters
 */
export const useOutwardBalanceLiftingRiceList = (
    millId: string,
    params?: OutwardBalanceLiftingRiceQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<OutwardBalanceLiftingRiceListResponse, Error>({
        queryKey: outwardBalanceLiftingRiceKeys.list(millId, params),
        queryFn: () => fetchOutwardBalanceLiftingRiceList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single outward balance lifting rice entry
 */
export const useOutwardBalanceLiftingRiceDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<OutwardBalanceLiftingRiceResponse, Error>({
        queryKey: outwardBalanceLiftingRiceKeys.detail(millId, id),
        queryFn: () => fetchOutwardBalanceLiftingRiceById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch outward balance lifting rice summary/statistics
 */
export const useOutwardBalanceLiftingRiceSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<OutwardBalanceLiftingRiceSummaryResponse, Error>({
        queryKey: outwardBalanceLiftingRiceKeys.summary(millId),
        queryFn: () => fetchOutwardBalanceLiftingRiceSummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new outward balance lifting rice entry
 */
export const useCreateOutwardBalanceLiftingRice = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        OutwardBalanceLiftingRiceResponse,
        Error,
        CreateOutwardBalanceLiftingRiceRequest
    >({
        mutationFn: (data) => createOutwardBalanceLiftingRice(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: outwardBalanceLiftingRiceKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: outwardBalanceLiftingRiceKeys.summaries(),
            })
            toast.success(
                'Outward balance lifting rice entry created successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to create outward balance lifting rice entry'
            )
        },
    })
}

/**
 * Hook to update an existing outward balance lifting rice entry
 */
export const useUpdateOutwardBalanceLiftingRice = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        OutwardBalanceLiftingRiceResponse,
        Error,
        UpdateOutwardBalanceLiftingRiceRequest
    >({
        mutationFn: (data) => updateOutwardBalanceLiftingRice(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: outwardBalanceLiftingRiceKeys.lists(),
            })
            queryClient.setQueryData(
                outwardBalanceLiftingRiceKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: outwardBalanceLiftingRiceKeys.summaries(),
            })
            toast.success(
                'Outward balance lifting rice entry updated successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to update outward balance lifting rice entry'
            )
        },
    })
}

/**
 * Hook to delete an outward balance lifting rice entry
 */
export const useDeleteOutwardBalanceLiftingRice = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteOutwardBalanceLiftingRice(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: outwardBalanceLiftingRiceKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: outwardBalanceLiftingRiceKeys.summaries(),
            })
            toast.success(
                'Outward balance lifting rice entry deleted successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to delete outward balance lifting rice entry'
            )
        },
    })
}

/**
 * Hook to bulk delete outward balance lifting rice entries
 */
export const useBulkDeleteOutwardBalanceLiftingRice = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteOutwardBalanceLiftingRice(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: outwardBalanceLiftingRiceKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: outwardBalanceLiftingRiceKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to delete outward balance lifting rice entries'
            )
        },
    })
}

/**
 * Hook to export outward balance lifting rice entries
 */
export const useExportOutwardBalanceLiftingRice = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        {
            params?: OutwardBalanceLiftingRiceQueryParams
            format?: 'csv' | 'xlsx'
        }
    >({
        mutationFn: ({ params, format }) =>
            exportOutwardBalanceLiftingRice(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
