/**
 * Rice Purchase Hooks
 * React Query hooks for Rice Purchase data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchRicePurchaseList,
    fetchRicePurchaseById,
    fetchRicePurchaseSummary,
    createRicePurchase,
    updateRicePurchase,
    deleteRicePurchase,
    bulkDeleteRicePurchase,
    exportRicePurchase,
} from './service'
import type {
    RicePurchaseResponse,
    RicePurchaseListResponse,
    RicePurchaseSummaryResponse,
    CreateRicePurchaseRequest,
    UpdateRicePurchaseRequest,
    RicePurchaseQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const ricePurchaseKeys = {
    all: ['rice-purchase'] as const,
    lists: () => [...ricePurchaseKeys.all, 'list'] as const,
    list: (millId: string, params?: RicePurchaseQueryParams) =>
        [...ricePurchaseKeys.lists(), millId, params] as const,
    details: () => [...ricePurchaseKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...ricePurchaseKeys.details(), millId, id] as const,
    summaries: () => [...ricePurchaseKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<RicePurchaseQueryParams, 'startDate' | 'endDate'>
    ) => [...ricePurchaseKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch rice purchase list with pagination and filters
 */
export const useRicePurchaseList = (
    millId: string,
    params?: RicePurchaseQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<RicePurchaseListResponse, Error>({
        queryKey: ricePurchaseKeys.list(millId, params),
        queryFn: () => fetchRicePurchaseList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single rice purchase entry
 */
export const useRicePurchaseDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<RicePurchaseResponse, Error>({
        queryKey: ricePurchaseKeys.detail(millId, id),
        queryFn: () => fetchRicePurchaseById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch rice purchase summary/statistics
 */
export const useRicePurchaseSummary = (
    millId: string,
    params?: Pick<RicePurchaseQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<RicePurchaseSummaryResponse, Error>({
        queryKey: ricePurchaseKeys.summary(millId, params),
        queryFn: () => fetchRicePurchaseSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new rice purchase entry
 */
export const useCreateRicePurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<RicePurchaseResponse, Error, CreateRicePurchaseRequest>({
        mutationFn: (data) => createRicePurchase(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ricePurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: ricePurchaseKeys.summaries(),
            })
            toast.success('Rice purchase entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create rice purchase entry')
        },
    })
}

/**
 * Hook to update an existing rice purchase entry
 */
export const useUpdateRicePurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<RicePurchaseResponse, Error, UpdateRicePurchaseRequest>({
        mutationFn: (data) => updateRicePurchase(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ricePurchaseKeys.lists(),
            })
            queryClient.setQueryData(
                ricePurchaseKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: ricePurchaseKeys.summaries(),
            })
            toast.success('Rice purchase entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update rice purchase entry')
        },
    })
}

/**
 * Hook to delete a rice purchase entry
 */
export const useDeleteRicePurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteRicePurchase(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ricePurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: ricePurchaseKeys.summaries(),
            })
            toast.success('Rice purchase entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete rice purchase entry')
        },
    })
}

/**
 * Hook to bulk delete rice purchase entries
 */
export const useBulkDeleteRicePurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteRicePurchase(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: ricePurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: ricePurchaseKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete rice purchase entries'
            )
        },
    })
}

/**
 * Hook to export rice purchase entries
 */
export const useExportRicePurchase = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: RicePurchaseQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportRicePurchase(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
