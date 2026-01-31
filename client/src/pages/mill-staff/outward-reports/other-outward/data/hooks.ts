/**
 * Other Outward Hooks
 * React Query hooks for Other Outward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchOtherOutwardList,
    fetchOtherOutwardById,
    fetchOtherOutwardSummary,
    createOtherOutward,
    updateOtherOutward,
    deleteOtherOutward,
    bulkDeleteOtherOutward,
    exportOtherOutward,
} from './service'
import type {
    OtherOutwardResponse,
    OtherOutwardListResponse,
    OtherOutwardSummaryResponse,
    CreateOtherOutwardRequest,
    UpdateOtherOutwardRequest,
    OtherOutwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const otherOutwardKeys = {
    all: ['other-outward'] as const,
    lists: () => [...otherOutwardKeys.all, 'list'] as const,
    list: (millId: string, params?: OtherOutwardQueryParams) =>
        [...otherOutwardKeys.lists(), millId, params] as const,
    details: () => [...otherOutwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...otherOutwardKeys.details(), millId, id] as const,
    summaries: () => [...otherOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<OtherOutwardQueryParams, 'startDate' | 'endDate'>
    ) => [...otherOutwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch other outward list with pagination and filters
 */
export const useOtherOutwardList = (
    millId: string,
    params?: OtherOutwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<OtherOutwardListResponse, Error>({
        queryKey: otherOutwardKeys.list(millId, params),
        queryFn: () => fetchOtherOutwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single other outward entry
 */
export const useOtherOutwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<OtherOutwardResponse, Error>({
        queryKey: otherOutwardKeys.detail(millId, id),
        queryFn: () => fetchOtherOutwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch other outward summary/statistics
 */
export const useOtherOutwardSummary = (
    millId: string,
    params?: Pick<OtherOutwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<OtherOutwardSummaryResponse, Error>({
        queryKey: otherOutwardKeys.summary(millId, params),
        queryFn: () => fetchOtherOutwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new other outward entry
 */
export const useCreateOtherOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<OtherOutwardResponse, Error, CreateOtherOutwardRequest>({
        mutationFn: (data) => createOtherOutward(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.summaries(),
            })
            toast.success('Other outward entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create other outward entry')
        },
    })
}

/**
 * Hook to update an existing other outward entry
 */
export const useUpdateOtherOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<OtherOutwardResponse, Error, UpdateOtherOutwardRequest>({
        mutationFn: (data) => updateOtherOutward(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                otherOutwardKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.summaries(),
            })
            toast.success('Other outward entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update other outward entry')
        },
    })
}

/**
 * Hook to delete an other outward entry
 */
export const useDeleteOtherOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteOtherOutward(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.summaries(),
            })
            toast.success('Other outward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete other outward entry')
        },
    })
}

/**
 * Hook to bulk delete other outward entries
 */
export const useBulkDeleteOtherOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteOtherOutward(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export other outward entries
 */
export const useExportOtherOutward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: OtherOutwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportOtherOutward(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `other-outward-${new Date().toISOString().split('T')[0]}.${format}`
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
