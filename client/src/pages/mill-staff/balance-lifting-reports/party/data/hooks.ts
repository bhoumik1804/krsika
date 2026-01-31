/**
 * Balance Lifting Party Hooks
 * React Query hooks for Balance Lifting Party data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchBalanceLiftingPartyList,
    fetchBalanceLiftingPartyById,
    fetchBalanceLiftingPartySummary,
    createBalanceLiftingParty,
    updateBalanceLiftingParty,
    deleteBalanceLiftingParty,
    bulkDeleteBalanceLiftingParty,
    exportBalanceLiftingParty,
} from './service'
import type {
    BalanceLiftingPartyResponse,
    BalanceLiftingPartyListResponse,
    BalanceLiftingPartySummaryResponse,
    CreateBalanceLiftingPartyRequest,
    UpdateBalanceLiftingPartyRequest,
    BalanceLiftingPartyQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const balanceLiftingPartyKeys = {
    all: ['balance-lifting-party'] as const,
    lists: () => [...balanceLiftingPartyKeys.all, 'list'] as const,
    list: (millId: string, params?: BalanceLiftingPartyQueryParams) =>
        [...balanceLiftingPartyKeys.lists(), millId, params] as const,
    details: () => [...balanceLiftingPartyKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...balanceLiftingPartyKeys.details(), millId, id] as const,
    summaries: () => [...balanceLiftingPartyKeys.all, 'summary'] as const,
    summary: (millId: string) =>
        [...balanceLiftingPartyKeys.summaries(), millId] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch balance lifting party list with pagination and filters
 */
export const useBalanceLiftingPartyList = (
    millId: string,
    params?: BalanceLiftingPartyQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingPartyListResponse, Error>({
        queryKey: balanceLiftingPartyKeys.list(millId, params),
        queryFn: () => fetchBalanceLiftingPartyList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single balance lifting party entry
 */
export const useBalanceLiftingPartyDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingPartyResponse, Error>({
        queryKey: balanceLiftingPartyKeys.detail(millId, id),
        queryFn: () => fetchBalanceLiftingPartyById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch balance lifting party summary/statistics
 */
export const useBalanceLiftingPartySummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<BalanceLiftingPartySummaryResponse, Error>({
        queryKey: balanceLiftingPartyKeys.summary(millId),
        queryFn: () => fetchBalanceLiftingPartySummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new balance lifting party entry
 */
export const useCreateBalanceLiftingParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        BalanceLiftingPartyResponse,
        Error,
        CreateBalanceLiftingPartyRequest
    >({
        mutationFn: (data) => createBalanceLiftingParty(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPartyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPartyKeys.summaries(),
            })
            toast.success('Balance lifting party entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create balance lifting party entry'
            )
        },
    })
}

/**
 * Hook to update an existing balance lifting party entry
 */
export const useUpdateBalanceLiftingParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        BalanceLiftingPartyResponse,
        Error,
        UpdateBalanceLiftingPartyRequest
    >({
        mutationFn: (data) => updateBalanceLiftingParty(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPartyKeys.lists(),
            })
            queryClient.setQueryData(
                balanceLiftingPartyKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPartyKeys.summaries(),
            })
            toast.success('Balance lifting party entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update balance lifting party entry'
            )
        },
    })
}

/**
 * Hook to delete a balance lifting party entry
 */
export const useDeleteBalanceLiftingParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteBalanceLiftingParty(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPartyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPartyKeys.summaries(),
            })
            toast.success('Balance lifting party entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete balance lifting party entry'
            )
        },
    })
}

/**
 * Hook to bulk delete balance lifting party entries
 */
export const useBulkDeleteBalanceLiftingParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteBalanceLiftingParty(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPartyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: balanceLiftingPartyKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to delete balance lifting party entries'
            )
        },
    })
}

/**
 * Hook to export balance lifting party entries
 */
export const useExportBalanceLiftingParty = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: BalanceLiftingPartyQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportBalanceLiftingParty(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
