/**
 * FRK Purchase Hooks
 * React Query hooks for FRK Purchase data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchFrkPurchaseList,
    fetchFrkPurchaseById,
    fetchFrkPurchaseSummary,
    createFrkPurchase,
    updateFrkPurchase,
    deleteFrkPurchase,
    bulkDeleteFrkPurchase,
    exportFrkPurchase,
} from './service'
import type {
    FrkPurchaseResponse,
    FrkPurchaseListResponse,
    FrkPurchaseSummaryResponse,
    CreateFrkPurchaseRequest,
    UpdateFrkPurchaseRequest,
    FrkPurchaseQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const frkPurchaseKeys = {
    all: ['frk-purchase'] as const,
    lists: () => [...frkPurchaseKeys.all, 'list'] as const,
    list: (millId: string, params?: FrkPurchaseQueryParams) =>
        [...frkPurchaseKeys.lists(), millId, params] as const,
    details: () => [...frkPurchaseKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...frkPurchaseKeys.details(), millId, id] as const,
    summaries: () => [...frkPurchaseKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<FrkPurchaseQueryParams, 'startDate' | 'endDate'>
    ) => [...frkPurchaseKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch FRK purchase list with pagination and filters
 */
export const useFrkPurchaseList = (
    millId: string,
    params?: FrkPurchaseQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<FrkPurchaseListResponse, Error>({
        queryKey: frkPurchaseKeys.list(millId, params),
        queryFn: () => fetchFrkPurchaseList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single FRK purchase entry
 */
export const useFrkPurchaseDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<FrkPurchaseResponse, Error>({
        queryKey: frkPurchaseKeys.detail(millId, id),
        queryFn: () => fetchFrkPurchaseById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch FRK purchase summary/statistics
 */
export const useFrkPurchaseSummary = (
    millId: string,
    params?: Pick<FrkPurchaseQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<FrkPurchaseSummaryResponse, Error>({
        queryKey: frkPurchaseKeys.summary(millId, params),
        queryFn: () => fetchFrkPurchaseSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new FRK purchase entry
 */
export const useCreateFrkPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<FrkPurchaseResponse, Error, CreateFrkPurchaseRequest>({
        mutationFn: (data) => createFrkPurchase(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: frkPurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: frkPurchaseKeys.summaries(),
            })
            toast.success('FRK purchase entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create FRK purchase entry')
        },
    })
}

/**
 * Hook to update an existing FRK purchase entry
 */
export const useUpdateFrkPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<FrkPurchaseResponse, Error, UpdateFrkPurchaseRequest>({
        mutationFn: (data) => updateFrkPurchase(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: frkPurchaseKeys.lists(),
            })
            queryClient.setQueryData(
                frkPurchaseKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: frkPurchaseKeys.summaries(),
            })
            toast.success('FRK purchase entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update FRK purchase entry')
        },
    })
}

/**
 * Hook to delete a FRK purchase entry
 */
export const useDeleteFrkPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteFrkPurchase(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: frkPurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: frkPurchaseKeys.summaries(),
            })
            toast.success('FRK purchase entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete FRK purchase entry')
        },
    })
}

/**
 * Hook to bulk delete FRK purchase entries
 */
export const useBulkDeleteFrkPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteFrkPurchase(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: frkPurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: frkPurchaseKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete FRK purchase entries'
            )
        },
    })
}

/**
 * Hook to export FRK purchase entries
 */
export const useExportFrkPurchase = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: FrkPurchaseQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportFrkPurchase(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
