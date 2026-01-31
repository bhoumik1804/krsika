/**
 * Balance Lifting Sales Paddy Hooks
 * React Query hooks for Balance Lifting Sales Paddy data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchBalanceLiftingSalesPaddyList,
    fetchBalanceLiftingSalesPaddyById,
    fetchBalanceLiftingSalesPaddySummary,
    createBalanceLiftingSalesPaddy,
    updateBalanceLiftingSalesPaddy,
    deleteBalanceLiftingSalesPaddy,
    bulkDeleteBalanceLiftingSalesPaddy,
    exportBalanceLiftingSalesPaddy,
} from './service'
import type {
    BalanceLiftingSalesPaddyResponse,
    BalanceLiftingSalesPaddyListResponse,
    BalanceLiftingSalesPaddySummaryResponse,
    CreateBalanceLiftingSalesPaddyRequest,
    UpdateBalanceLiftingSalesPaddyRequest,
    BalanceLiftingSalesPaddyQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const balanceLiftingSalesPaddyKeys = {
    all: ['balance-lifting-sales-paddy'] as const,
    lists: () => [...balanceLiftingSalesPaddyKeys.all, 'list'] as const,
    list: (millId: string, params?: BalanceLiftingSalesPaddyQueryParams) =>
        [...balanceLiftingSalesPaddyKeys.lists(), millId, params] as const,
    details: () => [...balanceLiftingSalesPaddyKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...balanceLiftingSalesPaddyKeys.details(), millId, id] as const,
    summaries: () => [...balanceLiftingSalesPaddyKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<
            BalanceLiftingSalesPaddyQueryParams,
            'startDate' | 'endDate'
        >
    ) => [...balanceLiftingSalesPaddyKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch balance lifting sales paddy list with pagination and filters
 */
export const useBalanceLiftingSalesPaddyList = (
    millId: string,
    params?: BalanceLiftingSalesPaddyQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingSalesPaddyListResponse, Error>({
        queryKey: balanceLiftingSalesPaddyKeys.list(millId, params),
        queryFn: () => fetchBalanceLiftingSalesPaddyList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single balance lifting sales paddy entry
 */
export const useBalanceLiftingSalesPaddyDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingSalesPaddyResponse, Error>({
        queryKey: balanceLiftingSalesPaddyKeys.detail(millId, id),
        queryFn: () => fetchBalanceLiftingSalesPaddyById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch balance lifting sales paddy summary/statistics
 */
export const useBalanceLiftingSalesPaddySummary = (
    millId: string,
    params?: Pick<BalanceLiftingSalesPaddyQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingSalesPaddySummaryResponse, Error>({
        queryKey: balanceLiftingSalesPaddyKeys.summary(millId, params),
        queryFn: () => fetchBalanceLiftingSalesPaddySummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new balance lifting sales paddy entry
 */
export const useCreateBalanceLiftingSalesPaddy = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        BalanceLiftingSalesPaddyResponse,
        Error,
        CreateBalanceLiftingSalesPaddyRequest
    >({
        mutationFn: (data) => createBalanceLiftingSalesPaddy(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingSalesPaddyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingSalesPaddyKeys.summaries(),
            })
            toast.success(
                'Balance lifting sales paddy entry created successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to create balance lifting sales paddy entry'
            )
        },
    })
}

/**
 * Hook to update an existing balance lifting sales paddy entry
 */
export const useUpdateBalanceLiftingSalesPaddy = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        BalanceLiftingSalesPaddyResponse,
        Error,
        UpdateBalanceLiftingSalesPaddyRequest
    >({
        mutationFn: (data) => updateBalanceLiftingSalesPaddy(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingSalesPaddyKeys.lists(),
            })
            queryClient.setQueryData(
                balanceLiftingSalesPaddyKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: balanceLiftingSalesPaddyKeys.summaries(),
            })
            toast.success(
                'Balance lifting sales paddy entry updated successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to update balance lifting sales paddy entry'
            )
        },
    })
}

/**
 * Hook to delete a balance lifting sales paddy entry
 */
export const useDeleteBalanceLiftingSalesPaddy = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteBalanceLiftingSalesPaddy(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingSalesPaddyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingSalesPaddyKeys.summaries(),
            })
            toast.success(
                'Balance lifting sales paddy entry deleted successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to delete balance lifting sales paddy entry'
            )
        },
    })
}

/**
 * Hook to bulk delete balance lifting sales paddy entries
 */
export const useBulkDeleteBalanceLiftingSalesPaddy = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteBalanceLiftingSalesPaddy(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingSalesPaddyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingSalesPaddyKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to delete balance lifting sales paddy entries'
            )
        },
    })
}

/**
 * Hook to export balance lifting sales paddy entries
 */
export const useExportBalanceLiftingSalesPaddy = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        {
            params?: BalanceLiftingSalesPaddyQueryParams
            format?: 'csv' | 'xlsx'
        }
    >({
        mutationFn: ({ params, format }) =>
            exportBalanceLiftingSalesPaddy(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
