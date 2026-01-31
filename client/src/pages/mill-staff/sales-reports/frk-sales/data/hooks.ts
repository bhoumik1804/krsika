/**
 * FRK Sales Hooks
 * React Query hooks for FRK Sales data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchFrkSaleList,
    fetchFrkSaleById,
    fetchFrkSaleSummary,
    createFrkSale,
    updateFrkSale,
    deleteFrkSale,
    bulkDeleteFrkSale,
    exportFrkSale,
} from './service'
import type {
    FrkSaleResponse,
    FrkSaleListResponse,
    FrkSaleSummaryResponse,
    CreateFrkSaleRequest,
    UpdateFrkSaleRequest,
    FrkSaleQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const frkSaleKeys = {
    all: ['frk-sales'] as const,
    lists: () => [...frkSaleKeys.all, 'list'] as const,
    list: (millId: string, params?: FrkSaleQueryParams) =>
        [...frkSaleKeys.lists(), millId, params] as const,
    details: () => [...frkSaleKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...frkSaleKeys.details(), millId, id] as const,
    summaries: () => [...frkSaleKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<FrkSaleQueryParams, 'startDate' | 'endDate'>
    ) => [...frkSaleKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch FRK sales list with pagination and filters
 */
export const useFrkSaleList = (
    millId: string,
    params?: FrkSaleQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<FrkSaleListResponse, Error>({
        queryKey: frkSaleKeys.list(millId, params),
        queryFn: () => fetchFrkSaleList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single FRK sale entry
 */
export const useFrkSaleDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<FrkSaleResponse, Error>({
        queryKey: frkSaleKeys.detail(millId, id),
        queryFn: () => fetchFrkSaleById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch FRK sales summary/statistics
 */
export const useFrkSaleSummary = (
    millId: string,
    params?: Pick<FrkSaleQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<FrkSaleSummaryResponse, Error>({
        queryKey: frkSaleKeys.summary(millId, params),
        queryFn: () => fetchFrkSaleSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new FRK sale entry
 */
export const useCreateFrkSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<FrkSaleResponse, Error, CreateFrkSaleRequest>({
        mutationFn: (data) => createFrkSale(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: frkSaleKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: frkSaleKeys.summaries(),
            })
            toast.success('FRK sale entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create FRK sale entry')
        },
    })
}

/**
 * Hook to update an existing FRK sale entry
 */
export const useUpdateFrkSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<FrkSaleResponse, Error, UpdateFrkSaleRequest>({
        mutationFn: (data) => updateFrkSale(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: frkSaleKeys.lists(),
            })
            queryClient.setQueryData(frkSaleKeys.detail(millId, data._id), data)
            queryClient.invalidateQueries({
                queryKey: frkSaleKeys.summaries(),
            })
            toast.success('FRK sale entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update FRK sale entry')
        },
    })
}

/**
 * Hook to delete a FRK sale entry
 */
export const useDeleteFrkSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteFrkSale(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: frkSaleKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: frkSaleKeys.summaries(),
            })
            toast.success('FRK sale entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete FRK sale entry')
        },
    })
}

/**
 * Hook to bulk delete FRK sale entries
 */
export const useBulkDeleteFrkSale = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteFrkSale(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: frkSaleKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: frkSaleKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete FRK sale entries')
        },
    })
}

/**
 * Hook to export FRK sale entries
 */
export const useExportFrkSale = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: FrkSaleQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportFrkSale(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
