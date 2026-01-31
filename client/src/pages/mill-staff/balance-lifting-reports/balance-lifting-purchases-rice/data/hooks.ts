/**
 * Balance Lifting Purchases Rice Hooks
 * React Query hooks for Balance Lifting Purchases Rice data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchBalanceLiftingPurchasesRiceList,
    fetchBalanceLiftingPurchasesRiceById,
    fetchBalanceLiftingPurchasesRiceSummary,
    createBalanceLiftingPurchasesRice,
    updateBalanceLiftingPurchasesRice,
    deleteBalanceLiftingPurchasesRice,
    bulkDeleteBalanceLiftingPurchasesRice,
    exportBalanceLiftingPurchasesRice,
} from './service'
import type {
    BalanceLiftingPurchasesRiceResponse,
    BalanceLiftingPurchasesRiceListResponse,
    BalanceLiftingPurchasesRiceSummaryResponse,
    CreateBalanceLiftingPurchasesRiceRequest,
    UpdateBalanceLiftingPurchasesRiceRequest,
    BalanceLiftingPurchasesRiceQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const balanceLiftingPurchasesRiceKeys = {
    all: ['balance-lifting-purchases-rice'] as const,
    lists: () => [...balanceLiftingPurchasesRiceKeys.all, 'list'] as const,
    list: (millId: string, params?: BalanceLiftingPurchasesRiceQueryParams) =>
        [...balanceLiftingPurchasesRiceKeys.lists(), millId, params] as const,
    details: () => [...balanceLiftingPurchasesRiceKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...balanceLiftingPurchasesRiceKeys.details(), millId, id] as const,
    summaries: () =>
        [...balanceLiftingPurchasesRiceKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<
            BalanceLiftingPurchasesRiceQueryParams,
            'startDate' | 'endDate'
        >
    ) =>
        [
            ...balanceLiftingPurchasesRiceKeys.summaries(),
            millId,
            params,
        ] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch balance lifting purchases rice list with pagination and filters
 */
export const useBalanceLiftingPurchasesRiceList = (
    millId: string,
    params?: BalanceLiftingPurchasesRiceQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingPurchasesRiceListResponse, Error>({
        queryKey: balanceLiftingPurchasesRiceKeys.list(millId, params),
        queryFn: () => fetchBalanceLiftingPurchasesRiceList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single balance lifting purchases rice entry
 */
export const useBalanceLiftingPurchasesRiceDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingPurchasesRiceResponse, Error>({
        queryKey: balanceLiftingPurchasesRiceKeys.detail(millId, id),
        queryFn: () => fetchBalanceLiftingPurchasesRiceById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch balance lifting purchases rice summary/statistics
 */
export const useBalanceLiftingPurchasesRiceSummary = (
    millId: string,
    params?: Pick<
        BalanceLiftingPurchasesRiceQueryParams,
        'startDate' | 'endDate'
    >,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingPurchasesRiceSummaryResponse, Error>({
        queryKey: balanceLiftingPurchasesRiceKeys.summary(millId, params),
        queryFn: () => fetchBalanceLiftingPurchasesRiceSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new balance lifting purchases rice entry
 */
export const useCreateBalanceLiftingPurchasesRice = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        BalanceLiftingPurchasesRiceResponse,
        Error,
        CreateBalanceLiftingPurchasesRiceRequest
    >({
        mutationFn: (data) => createBalanceLiftingPurchasesRice(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesRiceKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesRiceKeys.summaries(),
            })
            toast.success(
                'Balance lifting purchases rice entry created successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to create balance lifting purchases rice entry'
            )
        },
    })
}

/**
 * Hook to update an existing balance lifting purchases rice entry
 */
export const useUpdateBalanceLiftingPurchasesRice = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        BalanceLiftingPurchasesRiceResponse,
        Error,
        UpdateBalanceLiftingPurchasesRiceRequest
    >({
        mutationFn: (data) => updateBalanceLiftingPurchasesRice(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesRiceKeys.lists(),
            })
            queryClient.setQueryData(
                balanceLiftingPurchasesRiceKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesRiceKeys.summaries(),
            })
            toast.success(
                'Balance lifting purchases rice entry updated successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to update balance lifting purchases rice entry'
            )
        },
    })
}

/**
 * Hook to delete a balance lifting purchases rice entry
 */
export const useDeleteBalanceLiftingPurchasesRice = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteBalanceLiftingPurchasesRice(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesRiceKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesRiceKeys.summaries(),
            })
            toast.success(
                'Balance lifting purchases rice entry deleted successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to delete balance lifting purchases rice entry'
            )
        },
    })
}

/**
 * Hook to bulk delete balance lifting purchases rice entries
 */
export const useBulkDeleteBalanceLiftingPurchasesRice = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteBalanceLiftingPurchasesRice(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesRiceKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesRiceKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to delete balance lifting purchases rice entries'
            )
        },
    })
}

/**
 * Hook to export balance lifting purchases rice entries
 */
export const useExportBalanceLiftingPurchasesRice = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        {
            params?: BalanceLiftingPurchasesRiceQueryParams
            format?: 'csv' | 'xlsx'
        }
    >({
        mutationFn: ({ params, format }) =>
            exportBalanceLiftingPurchasesRice(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
