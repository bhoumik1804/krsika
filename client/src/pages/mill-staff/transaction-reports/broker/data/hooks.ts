/**
 * Broker Transaction Hooks
 * React Query hooks for Broker Transaction data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchBrokerTransactionList,
    fetchBrokerTransactionById,
    fetchBrokerTransactionSummary,
    createBrokerTransaction,
    updateBrokerTransaction,
    deleteBrokerTransaction,
    bulkDeleteBrokerTransaction,
    exportBrokerTransaction,
} from './service'
import type {
    BrokerTransactionResponse,
    BrokerTransactionListResponse,
    BrokerTransactionSummaryResponse,
    CreateBrokerTransactionRequest,
    UpdateBrokerTransactionRequest,
    BrokerTransactionQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const brokerTransactionKeys = {
    all: ['broker-transaction'] as const,
    lists: () => [...brokerTransactionKeys.all, 'list'] as const,
    list: (millId: string, params?: BrokerTransactionQueryParams) =>
        [...brokerTransactionKeys.lists(), millId, params] as const,
    details: () => [...brokerTransactionKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...brokerTransactionKeys.details(), millId, id] as const,
    summaries: () => [...brokerTransactionKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<
            BrokerTransactionQueryParams,
            'startDate' | 'endDate' | 'brokerName'
        >
    ) => [...brokerTransactionKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch broker transaction list with pagination and filters
 */
export const useBrokerTransactionList = (
    millId: string,
    params?: BrokerTransactionQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<BrokerTransactionListResponse, Error>({
        queryKey: brokerTransactionKeys.list(millId, params),
        queryFn: () => fetchBrokerTransactionList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single broker transaction entry
 */
export const useBrokerTransactionDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<BrokerTransactionResponse, Error>({
        queryKey: brokerTransactionKeys.detail(millId, id),
        queryFn: () => fetchBrokerTransactionById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch broker transaction summary/statistics
 */
export const useBrokerTransactionSummary = (
    millId: string,
    params?: Pick<
        BrokerTransactionQueryParams,
        'startDate' | 'endDate' | 'brokerName'
    >,
    options?: { enabled?: boolean }
) => {
    return useQuery<BrokerTransactionSummaryResponse, Error>({
        queryKey: brokerTransactionKeys.summary(millId, params),
        queryFn: () => fetchBrokerTransactionSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new broker transaction entry
 */
export const useCreateBrokerTransaction = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        BrokerTransactionResponse,
        Error,
        CreateBrokerTransactionRequest
    >({
        mutationFn: (data) => createBrokerTransaction(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: brokerTransactionKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: brokerTransactionKeys.summaries(),
            })
            toast.success('Broker transaction entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create broker transaction entry'
            )
        },
    })
}

/**
 * Hook to update an existing broker transaction entry
 */
export const useUpdateBrokerTransaction = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        BrokerTransactionResponse,
        Error,
        UpdateBrokerTransactionRequest
    >({
        mutationFn: (data) => updateBrokerTransaction(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: brokerTransactionKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                brokerTransactionKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: brokerTransactionKeys.summaries(),
            })
            toast.success('Broker transaction entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update broker transaction entry'
            )
        },
    })
}

/**
 * Hook to delete a broker transaction entry
 */
export const useDeleteBrokerTransaction = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteBrokerTransaction(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: brokerTransactionKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: brokerTransactionKeys.summaries(),
            })
            toast.success('Broker transaction entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete broker transaction entry'
            )
        },
    })
}

/**
 * Hook to bulk delete broker transaction entries
 */
export const useBulkDeleteBrokerTransaction = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteBrokerTransaction(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: brokerTransactionKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: brokerTransactionKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export broker transaction entries
 */
export const useExportBrokerTransaction = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: BrokerTransactionQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportBrokerTransaction(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `broker-transaction-${new Date().toISOString().split('T')[0]}.${format}`
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
