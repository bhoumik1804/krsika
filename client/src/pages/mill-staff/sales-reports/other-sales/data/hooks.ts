/**
 * Other Sales Hooks
 * React Query hooks for Other Sales data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchOtherSaleList,
    fetchOtherSaleById,
    fetchOtherSaleSummary,
    createOtherSale,
    updateOtherSale,
    deleteOtherSale,
    bulkDeleteOtherSale,
    exportOtherSale,
} from './service'
import type {
    OtherSaleResponse,
    OtherSaleListResponse,
    OtherSaleSummaryResponse,
    CreateOtherSaleRequest,
    UpdateOtherSaleRequest,
    OtherSaleQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const otherSaleKeys = {
    all: ['other-sales'] as const,
    lists: () => [...otherSaleKeys.all, 'list'] as const,
    list: (millId: string, params?: OtherSaleQueryParams) =>
        [...otherSaleKeys.lists(), millId, params] as const,
    details: () => [...otherSaleKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...otherSaleKeys.details(), millId, id] as const,
    summaries: () => [...otherSaleKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<OtherSaleQueryParams, 'startDate' | 'endDate'>
    ) => [...otherSaleKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch other sales list with pagination and filters
 */
export const useOtherSaleList = (
    millId: string,
    params?: OtherSaleQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<OtherSaleListResponse, Error>({
        queryKey: otherSaleKeys.list(millId, params),
        queryFn: () => fetchOtherSaleList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single other sale entry
 */
export const useOtherSaleDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<OtherSaleResponse, Error>({
        queryKey: otherSaleKeys.detail(millId, id),
        queryFn: () => fetchOtherSaleById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch other sales summary/statistics
 */
export const useOtherSaleSummary = (
    millId: string,
    params?: Pick<OtherSaleQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<OtherSaleSummaryResponse, Error>({
        queryKey: otherSaleKeys.summary(millId, params),
        queryFn: () => fetchOtherSaleSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new other sale entry
 */
export const useCreateOtherSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<OtherSaleResponse, Error, CreateOtherSaleRequest>({
        mutationFn: (data) => createOtherSale(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: otherSaleKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: otherSaleKeys.summaries(),
            })
            toast.success('Other sale entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create other sale entry')
        },
    })
}

/**
 * Hook to update an existing other sale entry
 */
export const useUpdateOtherSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<OtherSaleResponse, Error, UpdateOtherSaleRequest>({
        mutationFn: (data) => updateOtherSale(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: otherSaleKeys.lists(),
            })
            queryClient.setQueryData(
                otherSaleKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: otherSaleKeys.summaries(),
            })
            toast.success('Other sale entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update other sale entry')
        },
    })
}

/**
 * Hook to delete an other sale entry
 */
export const useDeleteOtherSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteOtherSale(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: otherSaleKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: otherSaleKeys.summaries(),
            })
            toast.success('Other sale entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete other sale entry')
        },
    })
}

/**
 * Hook to bulk delete other sale entries
 */
export const useBulkDeleteOtherSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteOtherSale(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: otherSaleKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: otherSaleKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete other sale entries')
        },
    })
}

/**
 * Hook to export other sale entries
 */
export const useExportOtherSale = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: OtherSaleQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportOtherSale(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
