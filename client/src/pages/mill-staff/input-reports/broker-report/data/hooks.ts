/**
 * Broker Report Hooks
 * React Query hooks for Broker data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchBrokerList,
    fetchBrokerById,
    fetchBrokerSummary,
    createBroker,
    updateBroker,
    deleteBroker,
    bulkDeleteBroker,
    exportBroker,
} from './service'
import type {
    BrokerResponse,
    BrokerListResponse,
    BrokerSummaryResponse,
    CreateBrokerRequest,
    UpdateBrokerRequest,
    BrokerQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const brokerKeys = {
    all: ['broker'] as const,
    lists: () => [...brokerKeys.all, 'list'] as const,
    list: (millId: string, params?: BrokerQueryParams) =>
        [...brokerKeys.lists(), millId, params] as const,
    details: () => [...brokerKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...brokerKeys.details(), millId, id] as const,
    summaries: () => [...brokerKeys.all, 'summary'] as const,
    summary: (millId: string) => [...brokerKeys.summaries(), millId] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch broker list with pagination and filters
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

/**
 * Hook to fetch a single broker
 */
export const useBrokerDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<BrokerResponse, Error>({
        queryKey: brokerKeys.detail(millId, id),
        queryFn: () => fetchBrokerById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch broker summary/statistics
 */
export const useBrokerSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<BrokerSummaryResponse, Error>({
        queryKey: brokerKeys.summary(millId),
        queryFn: () => fetchBrokerSummary(millId),
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

    return useMutation<BrokerResponse, Error, CreateBrokerRequest>({
        mutationFn: (data) => createBroker(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: brokerKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: brokerKeys.summaries(),
            })
            toast.success('Broker created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create broker')
        },
    })
}

/**
 * Hook to update an existing broker
 */
export const useUpdateBroker = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<BrokerResponse, Error, UpdateBrokerRequest>({
        mutationFn: (data) => updateBroker(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: brokerKeys.lists(),
            })
            queryClient.setQueryData(brokerKeys.detail(millId, data._id), data)
            queryClient.invalidateQueries({
                queryKey: brokerKeys.summaries(),
            })
            toast.success('Broker updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update broker')
        },
    })
}

/**
 * Hook to delete a broker
 */
export const useDeleteBroker = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteBroker(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: brokerKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: brokerKeys.summaries(),
            })
            toast.success('Broker deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete broker')
        },
    })
}

/**
 * Hook to bulk delete brokers
 */
export const useBulkDeleteBroker = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteBroker(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: brokerKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: brokerKeys.summaries(),
            })
            toast.success(`${ids.length} brokers deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete brokers')
        },
    })
}

/**
 * Hook to export brokers
 */
export const useExportBroker = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: BrokerQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportBroker(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
