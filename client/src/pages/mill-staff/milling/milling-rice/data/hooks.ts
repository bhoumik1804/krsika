/**
 * Milling Rice Hooks
 * React Query hooks for Milling Rice data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchMillingRiceList,
    fetchMillingRiceById,
    fetchMillingRiceSummary,
    createMillingRice,
    updateMillingRice,
    deleteMillingRice,
    bulkDeleteMillingRice,
    exportMillingRice,
} from './service'
import type {
    MillingRiceResponse,
    MillingRiceListResponse,
    MillingRiceSummaryResponse,
    CreateMillingRiceRequest,
    UpdateMillingRiceRequest,
    MillingRiceQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const millingRiceKeys = {
    all: ['milling-rice'] as const,
    lists: () => [...millingRiceKeys.all, 'list'] as const,
    list: (millId: string, params?: MillingRiceQueryParams) =>
        [...millingRiceKeys.lists(), millId, params] as const,
    details: () => [...millingRiceKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...millingRiceKeys.details(), millId, id] as const,
    summaries: () => [...millingRiceKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<MillingRiceQueryParams, 'startDate' | 'endDate'>
    ) => [...millingRiceKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch milling rice list with pagination and filters
 */
export const useMillingRiceList = (
    millId: string,
    params?: MillingRiceQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<MillingRiceListResponse, Error>({
        queryKey: millingRiceKeys.list(millId, params),
        queryFn: () => fetchMillingRiceList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single milling rice entry
 */
export const useMillingRiceDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<MillingRiceResponse, Error>({
        queryKey: millingRiceKeys.detail(millId, id),
        queryFn: () => fetchMillingRiceById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch milling rice summary/statistics
 */
export const useMillingRiceSummary = (
    millId: string,
    params?: Pick<MillingRiceQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<MillingRiceSummaryResponse, Error>({
        queryKey: millingRiceKeys.summary(millId, params),
        queryFn: () => fetchMillingRiceSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new milling rice entry
 */
export const useCreateMillingRice = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<MillingRiceResponse, Error, CreateMillingRiceRequest>({
        mutationFn: (data) => createMillingRice(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: millingRiceKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: millingRiceKeys.summaries(),
            })
            toast.success('Milling rice entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create milling rice entry')
        },
    })
}

/**
 * Hook to update an existing milling rice entry
 */
export const useUpdateMillingRice = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<MillingRiceResponse, Error, UpdateMillingRiceRequest>({
        mutationFn: (data) => updateMillingRice(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: millingRiceKeys.lists(),
            })
            queryClient.setQueryData(
                millingRiceKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: millingRiceKeys.summaries(),
            })
            toast.success('Milling rice entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update milling rice entry')
        },
    })
}

/**
 * Hook to delete a milling rice entry
 */
export const useDeleteMillingRice = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteMillingRice(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: millingRiceKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: millingRiceKeys.summaries(),
            })
            toast.success('Milling rice entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete milling rice entry')
        },
    })
}

/**
 * Hook to bulk delete milling rice entries
 */
export const useBulkDeleteMillingRice = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteMillingRice(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: millingRiceKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: millingRiceKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete milling rice entries'
            )
        },
    })
}

/**
 * Hook to export milling rice entries
 */
export const useExportMillingRice = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: MillingRiceQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportMillingRice(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
