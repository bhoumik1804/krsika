/**
 * Bhusa Outward Hooks
 * React Query hooks for Bhusa Outward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchBhusaOutwardList,
    fetchBhusaOutwardById,
    fetchBhusaOutwardSummary,
    createBhusaOutward,
    updateBhusaOutward,
    deleteBhusaOutward,
    bulkDeleteBhusaOutward,
    exportBhusaOutward,
} from './service'
import type {
    BhusaOutwardResponse,
    BhusaOutwardListResponse,
    BhusaOutwardSummaryResponse,
    CreateBhusaOutwardRequest,
    UpdateBhusaOutwardRequest,
    BhusaOutwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const bhusaOutwardKeys = {
    all: ['bhusa-outward'] as const,
    lists: () => [...bhusaOutwardKeys.all, 'list'] as const,
    list: (millId: string, params?: BhusaOutwardQueryParams) =>
        [...bhusaOutwardKeys.lists(), millId, params] as const,
    details: () => [...bhusaOutwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...bhusaOutwardKeys.details(), millId, id] as const,
    summaries: () => [...bhusaOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<BhusaOutwardQueryParams, 'startDate' | 'endDate'>
    ) => [...bhusaOutwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch bhusa outward list with pagination and filters
 */
export const useBhusaOutwardList = (
    millId: string,
    params?: BhusaOutwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<BhusaOutwardListResponse, Error>({
        queryKey: bhusaOutwardKeys.list(millId, params),
        queryFn: () => fetchBhusaOutwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single bhusa outward entry
 */
export const useBhusaOutwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<BhusaOutwardResponse, Error>({
        queryKey: bhusaOutwardKeys.detail(millId, id),
        queryFn: () => fetchBhusaOutwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch bhusa outward summary/statistics
 */
export const useBhusaOutwardSummary = (
    millId: string,
    params?: Pick<BhusaOutwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<BhusaOutwardSummaryResponse, Error>({
        queryKey: bhusaOutwardKeys.summary(millId, params),
        queryFn: () => fetchBhusaOutwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new bhusa outward entry
 */
export const useCreateBhusaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<BhusaOutwardResponse, Error, CreateBhusaOutwardRequest>({
        mutationFn: (data) => createBhusaOutward(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: bhusaOutwardKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: bhusaOutwardKeys.summaries(),
            })
            toast.success('Bhusa outward entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create bhusa outward entry')
        },
    })
}

/**
 * Hook to update an existing bhusa outward entry
 */
export const useUpdateBhusaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<BhusaOutwardResponse, Error, UpdateBhusaOutwardRequest>({
        mutationFn: (data) => updateBhusaOutward(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: bhusaOutwardKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                bhusaOutwardKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: bhusaOutwardKeys.summaries(),
            })
            toast.success('Bhusa outward entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update bhusa outward entry')
        },
    })
}

/**
 * Hook to delete a bhusa outward entry
 */
export const useDeleteBhusaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteBhusaOutward(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: bhusaOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: bhusaOutwardKeys.summaries(),
            })
            toast.success('Bhusa outward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete bhusa outward entry')
        },
    })
}

/**
 * Hook to bulk delete bhusa outward entries
 */
export const useBulkDeleteBhusaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteBhusaOutward(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: bhusaOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: bhusaOutwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export bhusa outward entries
 */
export const useExportBhusaOutward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: BhusaOutwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportBhusaOutward(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `bhusa-outward-${new Date().toISOString().split('T')[0]}.${format}`
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
