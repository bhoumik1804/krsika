/**
 * Broker Report Hooks
 * React Query hooks for Broker data management (Mill Admin)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { BrokerReportData } from './schema'
import {
    fetchBrokerList,
    createBroker,
    updateBroker,
    deleteBroker,
    bulkDeleteBrokers,
    type BrokerListResponse,
    type BrokerQueryParams,
} from './service'

// Re-export types
export type { BrokerQueryParams, BrokerListResponse }

// ==========================================
// Query Keys
// ==========================================

export const brokerKeys = {
    all: (millId: string) => ['broker', millId] as const,
    lists: (millId: string) => [...brokerKeys.all(millId), 'list'] as const,
    list: (millId: string, params?: BrokerQueryParams) =>
        [...brokerKeys.lists(millId), params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch brokers list with pagination and filters
 */
export const useBrokerList = (
    millId: string,
    params?: BrokerQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<BrokerListResponse, Error>({
        queryKey: brokerKeys.list(millId, params),
        queryFn: () => fetchBrokerList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new broker
 */
export const useCreateBroker = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<BrokerReportData, Error, Partial<BrokerReportData>>({
        mutationFn: async (data) => {
            const promise = createBroker(millId, data)
            toast.promise(promise, {
                loading: 'Creating broker...',
                success: 'Broker created successfully',
                error: (err) => err.message || 'Failed to create broker',
            })
            return promise
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: brokerKeys.lists(millId),
            })
        },
    })
}

/**
 * Hook to update a broker
 */
export const useUpdateBroker = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        BrokerReportData,
        Error,
        { brokerId: string; data: Partial<BrokerReportData> }
    >({
        mutationFn: async ({ brokerId, data }) => {
            const promise = updateBroker(millId, brokerId, data)
            toast.promise(promise, {
                loading: 'Updating broker...',
                success: 'Broker updated successfully',
                error: (err) => err.message || 'Failed to update broker',
            })
            return promise
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: brokerKeys.lists(millId),
            })
        },
    })
}

/**
 * Hook to delete a broker
 */
export const useDeleteBroker = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: async (brokerId) => {
            const promise = deleteBroker(millId, brokerId)
            toast.promise(promise, {
                loading: 'Deleting broker...',
                success: 'Broker deleted successfully',
                error: (err) => err.message || 'Failed to delete broker',
            })
            return promise
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: brokerKeys.lists(millId),
            })
        },
    })
}

/**
 * Hook to bulk delete brokers
 */
export const useBulkDeleteBrokers = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: async (brokerIds) => {
            const promise = bulkDeleteBrokers(millId, brokerIds)
            toast.promise(promise, {
                loading: `Deleting ${brokerIds.length} broker${brokerIds.length > 1 ? 's' : ''}...`,
                success: `${brokerIds.length} broker${brokerIds.length > 1 ? 's' : ''} deleted successfully`,
                error: (err) => err.message || 'Failed to delete brokers',
            })
            return promise
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: brokerKeys.lists(millId),
            })
        },
    })
}
