/**
 * Paddy Purchase Hooks
 * React Query hooks for Paddy Purchase data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchPaddyPurchaseList,
    fetchPaddyPurchaseById,
    fetchPaddyPurchaseSummary,
    createPaddyPurchase,
    updatePaddyPurchase,
    deletePaddyPurchase,
    bulkDeletePaddyPurchase,
    exportPaddyPurchase,
} from './service'
import type {
    PaddyPurchaseResponse,
    PaddyPurchaseListResponse,
    PaddyPurchaseSummaryResponse,
    CreatePaddyPurchaseRequest,
    UpdatePaddyPurchaseRequest,
    PaddyPurchaseQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const paddyPurchaseKeys = {
    all: ['paddy-purchase'] as const,
    lists: () => [...paddyPurchaseKeys.all, 'list'] as const,
    list: (millId: string, params?: PaddyPurchaseQueryParams) =>
        [...paddyPurchaseKeys.lists(), millId, params] as const,
    details: () => [...paddyPurchaseKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...paddyPurchaseKeys.details(), millId, id] as const,
    summaries: () => [...paddyPurchaseKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<PaddyPurchaseQueryParams, 'startDate' | 'endDate'>
    ) => [...paddyPurchaseKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch paddy purchase list with pagination and filters
 */
export const usePaddyPurchaseList = (
    millId: string,
    params?: PaddyPurchaseQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<PaddyPurchaseListResponse, Error>({
        queryKey: paddyPurchaseKeys.list(millId, params),
        queryFn: () => fetchPaddyPurchaseList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single paddy purchase entry
 */
export const usePaddyPurchaseDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<PaddyPurchaseResponse, Error>({
        queryKey: paddyPurchaseKeys.detail(millId, id),
        queryFn: () => fetchPaddyPurchaseById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch paddy purchase summary/statistics
 */
export const usePaddyPurchaseSummary = (
    millId: string,
    params?: Pick<PaddyPurchaseQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<PaddyPurchaseSummaryResponse, Error>({
        queryKey: paddyPurchaseKeys.summary(millId, params),
        queryFn: () => fetchPaddyPurchaseSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new paddy purchase entry
 */
export const useCreatePaddyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        PaddyPurchaseResponse,
        Error,
        CreatePaddyPurchaseRequest
    >({
        mutationFn: (data) => createPaddyPurchase(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.summaries(),
            })
            toast.success('Paddy purchase entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create paddy purchase entry'
            )
        },
    })
}

/**
 * Hook to update an existing paddy purchase entry
 */
export const useUpdatePaddyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        PaddyPurchaseResponse,
        Error,
        UpdatePaddyPurchaseRequest
    >({
        mutationFn: (data) => updatePaddyPurchase(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                paddyPurchaseKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.summaries(),
            })
            toast.success('Paddy purchase entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update paddy purchase entry'
            )
        },
    })
}

/**
 * Hook to delete a paddy purchase entry
 */
export const useDeletePaddyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deletePaddyPurchase(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.summaries(),
            })
            toast.success('Paddy purchase entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete paddy purchase entry'
            )
        },
    })
}

/**
 * Hook to bulk delete paddy purchase entries
 */
export const useBulkDeletePaddyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeletePaddyPurchase(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: paddyPurchaseKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export paddy purchase entries
 */
export const useExportPaddyPurchase = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: PaddyPurchaseQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportPaddyPurchase(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `paddy-purchase-${new Date().toISOString().split('T')[0]}.${format}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
