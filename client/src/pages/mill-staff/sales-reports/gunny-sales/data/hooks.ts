/**
 * Gunny Sales Hooks
 * React Query hooks for Gunny Sales data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchGunnySaleList,
    fetchGunnySaleById,
    fetchGunnySaleSummary,
    createGunnySale,
    updateGunnySale,
    deleteGunnySale,
    bulkDeleteGunnySale,
    exportGunnySale,
} from './service'
import type {
    GunnySaleResponse,
    GunnySaleListResponse,
    GunnySaleSummaryResponse,
    CreateGunnySaleRequest,
    UpdateGunnySaleRequest,
    GunnySaleQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const gunnySaleKeys = {
    all: ['gunny-sales'] as const,
    lists: () => [...gunnySaleKeys.all, 'list'] as const,
    list: (millId: string, params?: GunnySaleQueryParams) =>
        [...gunnySaleKeys.lists(), millId, params] as const,
    details: () => [...gunnySaleKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...gunnySaleKeys.details(), millId, id] as const,
    summaries: () => [...gunnySaleKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<GunnySaleQueryParams, 'startDate' | 'endDate'>
    ) => [...gunnySaleKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch gunny sales list with pagination and filters
 */
export const useGunnySaleList = (
    millId: string,
    params?: GunnySaleQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<GunnySaleListResponse, Error>({
        queryKey: gunnySaleKeys.list(millId, params),
        queryFn: () => fetchGunnySaleList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single gunny sale entry
 */
export const useGunnySaleDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<GunnySaleResponse, Error>({
        queryKey: gunnySaleKeys.detail(millId, id),
        queryFn: () => fetchGunnySaleById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch gunny sales summary/statistics
 */
export const useGunnySaleSummary = (
    millId: string,
    params?: Pick<GunnySaleQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<GunnySaleSummaryResponse, Error>({
        queryKey: gunnySaleKeys.summary(millId, params),
        queryFn: () => fetchGunnySaleSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new gunny sale entry
 */
export const useCreateGunnySale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        GunnySaleResponse,
        Error,
        CreateGunnySaleRequest
    >({
        mutationFn: (data) => createGunnySale(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: gunnySaleKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: gunnySaleKeys.summaries(),
            })
            toast.success('Gunny sale entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create gunny sale entry'
            )
        },
    })
}

/**
 * Hook to update an existing gunny sale entry
 */
export const useUpdateGunnySale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        GunnySaleResponse,
        Error,
        UpdateGunnySaleRequest
    >({
        mutationFn: (data) => updateGunnySale(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: gunnySaleKeys.lists(),
            })
            queryClient.setQueryData(
                gunnySaleKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: gunnySaleKeys.summaries(),
            })
            toast.success('Gunny sale entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update gunny sale entry'
            )
        },
    })
}

/**
 * Hook to delete a gunny sale entry
 */
export const useDeleteGunnySale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteGunnySale(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: gunnySaleKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: gunnySaleKeys.summaries(),
            })
            toast.success('Gunny sale entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete gunny sale entry'
            )
        },
    })
}

/**
 * Hook to bulk delete gunny sale entries
 */
export const useBulkDeleteGunnySale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteGunnySale(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: gunnySaleKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: gunnySaleKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete gunny sale entries'
            )
        },
    })
}

/**
 * Hook to export gunny sale entries
 */
export const useExportGunnySale = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: GunnySaleQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportGunnySale(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
