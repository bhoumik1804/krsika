/**
 * Balance Lifting Purchases FRK Hooks
 * React Query hooks for Balance Lifting Purchases FRK data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchBalanceLiftingPurchasesFrkList,
    fetchBalanceLiftingPurchasesFrkById,
    fetchBalanceLiftingPurchasesFrkSummary,
    createBalanceLiftingPurchasesFrk,
    updateBalanceLiftingPurchasesFrk,
    deleteBalanceLiftingPurchasesFrk,
    bulkDeleteBalanceLiftingPurchasesFrk,
    exportBalanceLiftingPurchasesFrk,
} from './service'
import type {
    BalanceLiftingPurchasesFrkResponse,
    BalanceLiftingPurchasesFrkListResponse,
    BalanceLiftingPurchasesFrkSummaryResponse,
    CreateBalanceLiftingPurchasesFrkRequest,
    UpdateBalanceLiftingPurchasesFrkRequest,
    BalanceLiftingPurchasesFrkQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const balanceLiftingPurchasesFrkKeys = {
    all: ['balance-lifting-purchases-frk'] as const,
    lists: () => [...balanceLiftingPurchasesFrkKeys.all, 'list'] as const,
    list: (millId: string, params?: BalanceLiftingPurchasesFrkQueryParams) =>
        [...balanceLiftingPurchasesFrkKeys.lists(), millId, params] as const,
    details: () => [...balanceLiftingPurchasesFrkKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...balanceLiftingPurchasesFrkKeys.details(), millId, id] as const,
    summaries: () =>
        [...balanceLiftingPurchasesFrkKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<
            BalanceLiftingPurchasesFrkQueryParams,
            'startDate' | 'endDate'
        >
    ) =>
        [
            ...balanceLiftingPurchasesFrkKeys.summaries(),
            millId,
            params,
        ] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch balance lifting purchases FRK list with pagination and filters
 */
export const useBalanceLiftingPurchasesFrkList = (
    millId: string,
    params?: BalanceLiftingPurchasesFrkQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingPurchasesFrkListResponse, Error>({
        queryKey: balanceLiftingPurchasesFrkKeys.list(millId, params),
        queryFn: () => fetchBalanceLiftingPurchasesFrkList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single balance lifting purchases FRK entry
 */
export const useBalanceLiftingPurchasesFrkDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingPurchasesFrkResponse, Error>({
        queryKey: balanceLiftingPurchasesFrkKeys.detail(millId, id),
        queryFn: () => fetchBalanceLiftingPurchasesFrkById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch balance lifting purchases FRK summary/statistics
 */
export const useBalanceLiftingPurchasesFrkSummary = (
    millId: string,
    params?: Pick<
        BalanceLiftingPurchasesFrkQueryParams,
        'startDate' | 'endDate'
    >,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingPurchasesFrkSummaryResponse, Error>({
        queryKey: balanceLiftingPurchasesFrkKeys.summary(millId, params),
        queryFn: () => fetchBalanceLiftingPurchasesFrkSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new balance lifting purchases FRK entry
 */
export const useCreateBalanceLiftingPurchasesFrk = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        BalanceLiftingPurchasesFrkResponse,
        Error,
        CreateBalanceLiftingPurchasesFrkRequest
    >({
        mutationFn: (data) => createBalanceLiftingPurchasesFrk(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesFrkKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesFrkKeys.summaries(),
            })
            toast.success(
                'Balance lifting purchases FRK entry created successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to create balance lifting purchases FRK entry'
            )
        },
    })
}

/**
 * Hook to update an existing balance lifting purchases FRK entry
 */
export const useUpdateBalanceLiftingPurchasesFrk = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        BalanceLiftingPurchasesFrkResponse,
        Error,
        UpdateBalanceLiftingPurchasesFrkRequest
    >({
        mutationFn: (data) => updateBalanceLiftingPurchasesFrk(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesFrkKeys.lists(),
            })
            queryClient.setQueryData(
                balanceLiftingPurchasesFrkKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesFrkKeys.summaries(),
            })
            toast.success(
                'Balance lifting purchases FRK entry updated successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to update balance lifting purchases FRK entry'
            )
        },
    })
}

/**
 * Hook to delete a balance lifting purchases FRK entry
 */
export const useDeleteBalanceLiftingPurchasesFrk = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteBalanceLiftingPurchasesFrk(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesFrkKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesFrkKeys.summaries(),
            })
            toast.success(
                'Balance lifting purchases FRK entry deleted successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to delete balance lifting purchases FRK entry'
            )
        },
    })
}

/**
 * Hook to bulk delete balance lifting purchases FRK entries
 */
export const useBulkDeleteBalanceLiftingPurchasesFrk = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteBalanceLiftingPurchasesFrk(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesFrkKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesFrkKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to delete balance lifting purchases FRK entries'
            )
        },
    })
}

/**
 * Hook to export balance lifting purchases FRK entries
 */
export const useExportBalanceLiftingPurchasesFrk = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        {
            params?: BalanceLiftingPurchasesFrkQueryParams
            format?: 'csv' | 'xlsx'
        }
    >({
        mutationFn: ({ params, format }) =>
            exportBalanceLiftingPurchasesFrk(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
