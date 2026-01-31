/**
 * Balance Lifting Purchases Paddy Hooks
 * React Query hooks for Balance Lifting Purchases Paddy data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchBalanceLiftingPurchasesPaddyList,
    fetchBalanceLiftingPurchasesPaddyById,
    fetchBalanceLiftingPurchasesPaddySummary,
    createBalanceLiftingPurchasesPaddy,
    updateBalanceLiftingPurchasesPaddy,
    deleteBalanceLiftingPurchasesPaddy,
    bulkDeleteBalanceLiftingPurchasesPaddy,
    exportBalanceLiftingPurchasesPaddy,
} from './service'
import type {
    BalanceLiftingPurchasesPaddyResponse,
    BalanceLiftingPurchasesPaddyListResponse,
    BalanceLiftingPurchasesPaddySummaryResponse,
    CreateBalanceLiftingPurchasesPaddyRequest,
    UpdateBalanceLiftingPurchasesPaddyRequest,
    BalanceLiftingPurchasesPaddyQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const balanceLiftingPurchasesPaddyKeys = {
    all: ['balance-lifting-purchases-paddy'] as const,
    lists: () => [...balanceLiftingPurchasesPaddyKeys.all, 'list'] as const,
    list: (millId: string, params?: BalanceLiftingPurchasesPaddyQueryParams) =>
        [...balanceLiftingPurchasesPaddyKeys.lists(), millId, params] as const,
    details: () => [...balanceLiftingPurchasesPaddyKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...balanceLiftingPurchasesPaddyKeys.details(), millId, id] as const,
    summaries: () =>
        [...balanceLiftingPurchasesPaddyKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<
            BalanceLiftingPurchasesPaddyQueryParams,
            'startDate' | 'endDate'
        >
    ) =>
        [
            ...balanceLiftingPurchasesPaddyKeys.summaries(),
            millId,
            params,
        ] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch balance lifting purchases paddy list with pagination and filters
 */
export const useBalanceLiftingPurchasesPaddyList = (
    millId: string,
    params?: BalanceLiftingPurchasesPaddyQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingPurchasesPaddyListResponse, Error>({
        queryKey: balanceLiftingPurchasesPaddyKeys.list(millId, params),
        queryFn: () => fetchBalanceLiftingPurchasesPaddyList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single balance lifting purchases paddy entry
 */
export const useBalanceLiftingPurchasesPaddyDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingPurchasesPaddyResponse, Error>({
        queryKey: balanceLiftingPurchasesPaddyKeys.detail(millId, id),
        queryFn: () => fetchBalanceLiftingPurchasesPaddyById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch balance lifting purchases paddy summary/statistics
 */
export const useBalanceLiftingPurchasesPaddySummary = (
    millId: string,
    params?: Pick<
        BalanceLiftingPurchasesPaddyQueryParams,
        'startDate' | 'endDate'
    >,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingPurchasesPaddySummaryResponse, Error>({
        queryKey: balanceLiftingPurchasesPaddyKeys.summary(millId, params),
        queryFn: () => fetchBalanceLiftingPurchasesPaddySummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new balance lifting purchases paddy entry
 */
export const useCreateBalanceLiftingPurchasesPaddy = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        BalanceLiftingPurchasesPaddyResponse,
        Error,
        CreateBalanceLiftingPurchasesPaddyRequest
    >({
        mutationFn: (data) => createBalanceLiftingPurchasesPaddy(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesPaddyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesPaddyKeys.summaries(),
            })
            toast.success(
                'Balance lifting purchases paddy entry created successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to create balance lifting purchases paddy entry'
            )
        },
    })
}

/**
 * Hook to update an existing balance lifting purchases paddy entry
 */
export const useUpdateBalanceLiftingPurchasesPaddy = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        BalanceLiftingPurchasesPaddyResponse,
        Error,
        UpdateBalanceLiftingPurchasesPaddyRequest
    >({
        mutationFn: (data) => updateBalanceLiftingPurchasesPaddy(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesPaddyKeys.lists(),
            })
            queryClient.setQueryData(
                balanceLiftingPurchasesPaddyKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesPaddyKeys.summaries(),
            })
            toast.success(
                'Balance lifting purchases paddy entry updated successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to update balance lifting purchases paddy entry'
            )
        },
    })
}

/**
 * Hook to delete a balance lifting purchases paddy entry
 */
export const useDeleteBalanceLiftingPurchasesPaddy = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteBalanceLiftingPurchasesPaddy(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesPaddyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesPaddyKeys.summaries(),
            })
            toast.success(
                'Balance lifting purchases paddy entry deleted successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to delete balance lifting purchases paddy entry'
            )
        },
    })
}

/**
 * Hook to bulk delete balance lifting purchases paddy entries
 */
export const useBulkDeleteBalanceLiftingPurchasesPaddy = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) =>
            bulkDeleteBalanceLiftingPurchasesPaddy(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesPaddyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesPaddyKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to delete balance lifting purchases paddy entries'
            )
        },
    })
}

/**
 * Hook to export balance lifting purchases paddy entries
 */
export const useExportBalanceLiftingPurchasesPaddy = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        {
            params?: BalanceLiftingPurchasesPaddyQueryParams
            format?: 'csv' | 'xlsx'
        }
    >({
        mutationFn: ({ params, format }) =>
            exportBalanceLiftingPurchasesPaddy(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
