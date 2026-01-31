/**
 * Party Transaction Hooks
 * React Query hooks for Party Transaction data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchPartyTransactionList,
    fetchPartyTransactionById,
    fetchPartyTransactionSummary,
    createPartyTransaction,
    updatePartyTransaction,
    deletePartyTransaction,
    bulkDeletePartyTransaction,
    exportPartyTransaction,
} from './service'
import type {
    PartyTransactionResponse,
    PartyTransactionListResponse,
    PartyTransactionSummaryResponse,
    CreatePartyTransactionRequest,
    UpdatePartyTransactionRequest,
    PartyTransactionQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const partyTransactionKeys = {
    all: ['party-transaction'] as const,
    lists: () => [...partyTransactionKeys.all, 'list'] as const,
    list: (millId: string, params?: PartyTransactionQueryParams) =>
        [...partyTransactionKeys.lists(), millId, params] as const,
    details: () => [...partyTransactionKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...partyTransactionKeys.details(), millId, id] as const,
    summaries: () => [...partyTransactionKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<
            PartyTransactionQueryParams,
            'startDate' | 'endDate' | 'partyName'
        >
    ) => [...partyTransactionKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch party transaction list with pagination and filters
 */
export const usePartyTransactionList = (
    millId: string,
    params?: PartyTransactionQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<PartyTransactionListResponse, Error>({
        queryKey: partyTransactionKeys.list(millId, params),
        queryFn: () => fetchPartyTransactionList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single party transaction entry
 */
export const usePartyTransactionDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<PartyTransactionResponse, Error>({
        queryKey: partyTransactionKeys.detail(millId, id),
        queryFn: () => fetchPartyTransactionById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch party transaction summary/statistics
 */
export const usePartyTransactionSummary = (
    millId: string,
    params?: Pick<
        PartyTransactionQueryParams,
        'startDate' | 'endDate' | 'partyName'
    >,
    options?: { enabled?: boolean }
) => {
    return useQuery<PartyTransactionSummaryResponse, Error>({
        queryKey: partyTransactionKeys.summary(millId, params),
        queryFn: () => fetchPartyTransactionSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new party transaction entry
 */
export const useCreatePartyTransaction = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        PartyTransactionResponse,
        Error,
        CreatePartyTransactionRequest
    >({
        mutationFn: (data) => createPartyTransaction(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: partyTransactionKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: partyTransactionKeys.summaries(),
            })
            toast.success('Party transaction entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create party transaction entry'
            )
        },
    })
}

/**
 * Hook to update an existing party transaction entry
 */
export const useUpdatePartyTransaction = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        PartyTransactionResponse,
        Error,
        UpdatePartyTransactionRequest
    >({
        mutationFn: (data) => updatePartyTransaction(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: partyTransactionKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                partyTransactionKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: partyTransactionKeys.summaries(),
            })
            toast.success('Party transaction entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update party transaction entry'
            )
        },
    })
}

/**
 * Hook to delete a party transaction entry
 */
export const useDeletePartyTransaction = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deletePartyTransaction(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: partyTransactionKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: partyTransactionKeys.summaries(),
            })
            toast.success('Party transaction entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete party transaction entry'
            )
        },
    })
}

/**
 * Hook to bulk delete party transaction entries
 */
export const useBulkDeletePartyTransaction = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeletePartyTransaction(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: partyTransactionKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: partyTransactionKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export party transaction entries
 */
export const useExportPartyTransaction = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: PartyTransactionQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportPartyTransaction(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `party-transaction-${new Date().toISOString().split('T')[0]}.${format}`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
