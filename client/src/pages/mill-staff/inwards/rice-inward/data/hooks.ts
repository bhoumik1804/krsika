/**
 * Rice Inward Hooks
 * React Query hooks for Rice Inward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchRiceInwardList,
    fetchRiceInwardById,
    fetchRiceInwardSummary,
    createRiceInward,
    updateRiceInward,
    deleteRiceInward,
    bulkDeleteRiceInward,
    exportRiceInward,
} from './service'
import type {
    RiceInwardResponse,
    RiceInwardListResponse,
    RiceInwardSummaryResponse,
    CreateRiceInwardRequest,
    UpdateRiceInwardRequest,
    RiceInwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const riceInwardKeys = {
    all: ['rice-inward'] as const,
    lists: () => [...riceInwardKeys.all, 'list'] as const,
    list: (millId: string, params?: RiceInwardQueryParams) =>
        [...riceInwardKeys.lists(), millId, params] as const,
    details: () => [...riceInwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...riceInwardKeys.details(), millId, id] as const,
    summaries: () => [...riceInwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<RiceInwardQueryParams, 'startDate' | 'endDate'>
    ) => [...riceInwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch rice inward list with pagination and filters
 */
export const useRiceInwardList = (
    millId: string,
    params?: RiceInwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<RiceInwardListResponse, Error>({
        queryKey: riceInwardKeys.list(millId, params),
        queryFn: () => fetchRiceInwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single rice inward entry
 */
export const useRiceInwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<RiceInwardResponse, Error>({
        queryKey: riceInwardKeys.detail(millId, id),
        queryFn: () => fetchRiceInwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch rice inward summary/statistics
 */
export const useRiceInwardSummary = (
    millId: string,
    params?: Pick<RiceInwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<RiceInwardSummaryResponse, Error>({
        queryKey: riceInwardKeys.summary(millId, params),
        queryFn: () => fetchRiceInwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new rice inward entry
 */
export const useCreateRiceInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<RiceInwardResponse, Error, CreateRiceInwardRequest>({
        mutationFn: (data) => createRiceInward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.summaries(),
            })
            toast.success('Rice inward entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create rice inward entry')
        },
    })
}

/**
 * Hook to update an existing rice inward entry
 */
export const useUpdateRiceInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<RiceInwardResponse, Error, UpdateRiceInwardRequest>({
        mutationFn: (data) => updateRiceInward(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.lists(),
            })
            queryClient.setQueryData(
                riceInwardKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.summaries(),
            })
            toast.success('Rice inward entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update rice inward entry')
        },
    })
}

/**
 * Hook to delete a rice inward entry
 */
export const useDeleteRiceInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteRiceInward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.summaries(),
            })
            toast.success('Rice inward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete rice inward entry')
        },
    })
}

/**
 * Hook to bulk delete rice inward entries
 */
export const useBulkDeleteRiceInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteRiceInward(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete rice inward entries')
        },
    })
}

/**
 * Hook to export rice inward entries
 */
export const useExportRiceInward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: RiceInwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportRiceInward(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
