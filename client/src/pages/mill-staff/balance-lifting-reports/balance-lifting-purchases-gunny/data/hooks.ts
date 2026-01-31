/**
 * Balance Lifting Purchases Gunny Hooks
 * React Query hooks for Balance Lifting Purchases Gunny data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchBalanceLiftingPurchasesGunnyList,
    fetchBalanceLiftingPurchasesGunnyById,
    fetchBalanceLiftingPurchasesGunnySummary,
    createBalanceLiftingPurchasesGunny,
    updateBalanceLiftingPurchasesGunny,
    deleteBalanceLiftingPurchasesGunny,
    bulkDeleteBalanceLiftingPurchasesGunny,
    exportBalanceLiftingPurchasesGunny,
} from './service'
import type {
    BalanceLiftingPurchasesGunnyResponse,
    BalanceLiftingPurchasesGunnyListResponse,
    BalanceLiftingPurchasesGunnySummaryResponse,
    CreateBalanceLiftingPurchasesGunnyRequest,
    UpdateBalanceLiftingPurchasesGunnyRequest,
    BalanceLiftingPurchasesGunnyQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const balanceLiftingPurchasesGunnyKeys = {
    all: ['balance-lifting-purchases-gunny'] as const,
    lists: () => [...balanceLiftingPurchasesGunnyKeys.all, 'list'] as const,
    list: (millId: string, params?: BalanceLiftingPurchasesGunnyQueryParams) =>
        [...balanceLiftingPurchasesGunnyKeys.lists(), millId, params] as const,
    details: () => [...balanceLiftingPurchasesGunnyKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...balanceLiftingPurchasesGunnyKeys.details(), millId, id] as const,
    summaries: () =>
        [...balanceLiftingPurchasesGunnyKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<
            BalanceLiftingPurchasesGunnyQueryParams,
            'startDate' | 'endDate'
        >
    ) =>
        [
            ...balanceLiftingPurchasesGunnyKeys.summaries(),
            millId,
            params,
        ] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch balance lifting purchases gunny list with pagination and filters
 */
export const useBalanceLiftingPurchasesGunnyList = (
    millId: string,
    params?: BalanceLiftingPurchasesGunnyQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingPurchasesGunnyListResponse, Error>({
        queryKey: balanceLiftingPurchasesGunnyKeys.list(millId, params),
        queryFn: () => fetchBalanceLiftingPurchasesGunnyList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single balance lifting purchases gunny entry
 */
export const useBalanceLiftingPurchasesGunnyDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingPurchasesGunnyResponse, Error>({
        queryKey: balanceLiftingPurchasesGunnyKeys.detail(millId, id),
        queryFn: () => fetchBalanceLiftingPurchasesGunnyById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch balance lifting purchases gunny summary/statistics
 */
export const useBalanceLiftingPurchasesGunnySummary = (
    millId: string,
    params?: Pick<
        BalanceLiftingPurchasesGunnyQueryParams,
        'startDate' | 'endDate'
    >,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingPurchasesGunnySummaryResponse, Error>({
        queryKey: balanceLiftingPurchasesGunnyKeys.summary(millId, params),
        queryFn: () => fetchBalanceLiftingPurchasesGunnySummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new balance lifting purchases gunny entry
 */
export const useCreateBalanceLiftingPurchasesGunny = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        BalanceLiftingPurchasesGunnyResponse,
        Error,
        CreateBalanceLiftingPurchasesGunnyRequest
    >({
        mutationFn: (data) => createBalanceLiftingPurchasesGunny(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesGunnyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesGunnyKeys.summaries(),
            })
            toast.success(
                'Balance lifting purchases gunny entry created successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to create balance lifting purchases gunny entry'
            )
        },
    })
}

/**
 * Hook to update an existing balance lifting purchases gunny entry
 */
export const useUpdateBalanceLiftingPurchasesGunny = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        BalanceLiftingPurchasesGunnyResponse,
        Error,
        UpdateBalanceLiftingPurchasesGunnyRequest
    >({
        mutationFn: (data) => updateBalanceLiftingPurchasesGunny(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesGunnyKeys.lists(),
            })
            queryClient.setQueryData(
                balanceLiftingPurchasesGunnyKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesGunnyKeys.summaries(),
            })
            toast.success(
                'Balance lifting purchases gunny entry updated successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to update balance lifting purchases gunny entry'
            )
        },
    })
}

/**
 * Hook to delete a balance lifting purchases gunny entry
 */
export const useDeleteBalanceLiftingPurchasesGunny = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteBalanceLiftingPurchasesGunny(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesGunnyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesGunnyKeys.summaries(),
            })
            toast.success(
                'Balance lifting purchases gunny entry deleted successfully'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to delete balance lifting purchases gunny entry'
            )
        },
    })
}

/**
 * Hook to bulk delete balance lifting purchases gunny entries
 */
export const useBulkDeleteBalanceLiftingPurchasesGunny = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) =>
            bulkDeleteBalanceLiftingPurchasesGunny(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesGunnyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPurchasesGunnyKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to delete balance lifting purchases gunny entries'
            )
        },
    })
}

/**
 * Hook to export balance lifting purchases gunny entries
 */
export const useExportBalanceLiftingPurchasesGunny = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        {
            params?: BalanceLiftingPurchasesGunnyQueryParams
            format?: 'csv' | 'xlsx'
        }
    >({
        mutationFn: ({ params, format }) =>
            exportBalanceLiftingPurchasesGunny(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
