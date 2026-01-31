/**
 * Outward Balance Lifting Party Hooks
 * React Query hooks for Outward Balance Lifting Party data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchOutwardBalancePartyList,
    fetchOutwardBalancePartyById,
    fetchOutwardBalancePartySummary,
    createOutwardBalanceParty,
    updateOutwardBalanceParty,
    deleteOutwardBalanceParty,
    bulkDeleteOutwardBalanceParty,
    exportOutwardBalanceParty,
} from './service'
import type {
    OutwardBalancePartyResponse,
    OutwardBalancePartyListResponse,
    OutwardBalancePartySummaryResponse,
    CreateOutwardBalancePartyRequest,
    UpdateOutwardBalancePartyRequest,
    OutwardBalancePartyQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const outwardBalancePartyKeys = {
    all: ['outward-balance-party'] as const,
    lists: () => [...outwardBalancePartyKeys.all, 'list'] as const,
    list: (millId: string, params?: OutwardBalancePartyQueryParams) =>
        [...outwardBalancePartyKeys.lists(), millId, params] as const,
    details: () => [...outwardBalancePartyKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...outwardBalancePartyKeys.details(), millId, id] as const,
    summaries: () => [...outwardBalancePartyKeys.all, 'summary'] as const,
    summary: (millId: string) =>
        [...outwardBalancePartyKeys.summaries(), millId] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch outward balance party list with pagination and filters
 */
export const useOutwardBalancePartyList = (
    millId: string,
    params?: OutwardBalancePartyQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<OutwardBalancePartyListResponse, Error>({
        queryKey: outwardBalancePartyKeys.list(millId, params),
        queryFn: () => fetchOutwardBalancePartyList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single outward balance party entry
 */
export const useOutwardBalancePartyDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<OutwardBalancePartyResponse, Error>({
        queryKey: outwardBalancePartyKeys.detail(millId, id),
        queryFn: () => fetchOutwardBalancePartyById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch outward balance party summary/statistics
 */
export const useOutwardBalancePartySummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<OutwardBalancePartySummaryResponse, Error>({
        queryKey: outwardBalancePartyKeys.summary(millId),
        queryFn: () => fetchOutwardBalancePartySummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new outward balance party entry
 */
export const useCreateOutwardBalanceParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        OutwardBalancePartyResponse,
        Error,
        CreateOutwardBalancePartyRequest
    >({
        mutationFn: (data) => createOutwardBalanceParty(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: outwardBalancePartyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: outwardBalancePartyKeys.summaries(),
            })
            toast.success('Outward balance party entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create outward balance party entry'
            )
        },
    })
}

/**
 * Hook to update an existing outward balance party entry
 */
export const useUpdateOutwardBalanceParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        OutwardBalancePartyResponse,
        Error,
        UpdateOutwardBalancePartyRequest
    >({
        mutationFn: (data) => updateOutwardBalanceParty(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: outwardBalancePartyKeys.lists(),
            })
            queryClient.setQueryData(
                outwardBalancePartyKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: outwardBalancePartyKeys.summaries(),
            })
            toast.success('Outward balance party entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update outward balance party entry'
            )
        },
    })
}

/**
 * Hook to delete an outward balance party entry
 */
export const useDeleteOutwardBalanceParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteOutwardBalanceParty(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: outwardBalancePartyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: outwardBalancePartyKeys.summaries(),
            })
            toast.success('Outward balance party entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete outward balance party entry'
            )
        },
    })
}

/**
 * Hook to bulk delete outward balance party entries
 */
export const useBulkDeleteOutwardBalanceParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteOutwardBalanceParty(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: outwardBalancePartyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: outwardBalancePartyKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to delete outward balance party entries'
            )
        },
    })
}

/**
 * Hook to export outward balance party entries
 */
export const useExportOutwardBalanceParty = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: OutwardBalancePartyQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportOutwardBalanceParty(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
