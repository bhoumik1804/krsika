/**
 * Milling Paddy Hooks
 * React Query hooks for Milling Paddy data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchMillingPaddyList,
    fetchMillingPaddyById,
    fetchMillingPaddySummary,
    createMillingPaddy,
    updateMillingPaddy,
    deleteMillingPaddy,
    bulkDeleteMillingPaddy,
    exportMillingPaddy,
} from './service'
import type {
    MillingPaddyResponse,
    MillingPaddyListResponse,
    MillingPaddySummaryResponse,
    CreateMillingPaddyRequest,
    UpdateMillingPaddyRequest,
    MillingPaddyQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const millingPaddyKeys = {
    all: ['milling-paddy'] as const,
    lists: () => [...millingPaddyKeys.all, 'list'] as const,
    list: (millId: string, params?: MillingPaddyQueryParams) =>
        [...millingPaddyKeys.lists(), millId, params] as const,
    details: () => [...millingPaddyKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...millingPaddyKeys.details(), millId, id] as const,
    summaries: () => [...millingPaddyKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<MillingPaddyQueryParams, 'startDate' | 'endDate'>
    ) => [...millingPaddyKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch milling paddy list with pagination and filters
 */
export const useMillingPaddyList = (
    millId: string,
    params?: MillingPaddyQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<MillingPaddyListResponse, Error>({
        queryKey: millingPaddyKeys.list(millId, params),
        queryFn: () => fetchMillingPaddyList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single milling paddy entry
 */
export const useMillingPaddyDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<MillingPaddyResponse, Error>({
        queryKey: millingPaddyKeys.detail(millId, id),
        queryFn: () => fetchMillingPaddyById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch milling paddy summary/statistics
 */
export const useMillingPaddySummary = (
    millId: string,
    params?: Pick<MillingPaddyQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<MillingPaddySummaryResponse, Error>({
        queryKey: millingPaddyKeys.summary(millId, params),
        queryFn: () => fetchMillingPaddySummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new milling paddy entry
 */
export const useCreateMillingPaddy = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<MillingPaddyResponse, Error, CreateMillingPaddyRequest>({
        mutationFn: (data) => createMillingPaddy(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: millingPaddyKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: millingPaddyKeys.summaries(),
            })
            toast.success('Milling paddy entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create milling paddy entry')
        },
    })
}

/**
 * Hook to update an existing milling paddy entry
 */
export const useUpdateMillingPaddy = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<MillingPaddyResponse, Error, UpdateMillingPaddyRequest>({
        mutationFn: (data) => updateMillingPaddy(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: millingPaddyKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                millingPaddyKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: millingPaddyKeys.summaries(),
            })
            toast.success('Milling paddy entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update milling paddy entry')
        },
    })
}

/**
 * Hook to delete a milling paddy entry
 */
export const useDeleteMillingPaddy = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteMillingPaddy(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: millingPaddyKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: millingPaddyKeys.summaries(),
            })
            toast.success('Milling paddy entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete milling paddy entry')
        },
    })
}

/**
 * Hook to bulk delete milling paddy entries
 */
export const useBulkDeleteMillingPaddy = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteMillingPaddy(millId, ids),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: millingPaddyKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: millingPaddyKeys.summaries(),
            })
            toast.success('Milling paddy entries deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete milling paddy entries'
            )
        },
    })
}

/**
 * Hook to export milling paddy entries
 */
export const useExportMillingPaddy = (millId: string) => {
    return useMutation<Blob, Error, MillingPaddyQueryParams | undefined>({
        mutationFn: (params) => exportMillingPaddy(millId, params),
        onSuccess: (blob) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute(
                'download',
                `milling-paddy-${new Date().toISOString().split('T')[0]}.csv`
            )
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export milling paddy data')
        },
    })
}
