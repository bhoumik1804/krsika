/**
 * Private Paddy Outward Hooks
 * React Query hooks for Private Paddy Outward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchPrivatePaddyOutwardList,
    fetchPrivatePaddyOutwardById,
    fetchPrivatePaddyOutwardSummary,
    createPrivatePaddyOutward,
    updatePrivatePaddyOutward,
    deletePrivatePaddyOutward,
    bulkDeletePrivatePaddyOutward,
    exportPrivatePaddyOutward,
} from './service'
import type {
    PrivatePaddyOutwardResponse,
    PrivatePaddyOutwardListResponse,
    PrivatePaddyOutwardSummaryResponse,
    CreatePrivatePaddyOutwardRequest,
    UpdatePrivatePaddyOutwardRequest,
    PrivatePaddyOutwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const privatePaddyOutwardKeys = {
    all: ['private-paddy-outward'] as const,
    lists: () => [...privatePaddyOutwardKeys.all, 'list'] as const,
    list: (millId: string, params?: PrivatePaddyOutwardQueryParams) =>
        [...privatePaddyOutwardKeys.lists(), millId, params] as const,
    details: () => [...privatePaddyOutwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...privatePaddyOutwardKeys.details(), millId, id] as const,
    summaries: () => [...privatePaddyOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<PrivatePaddyOutwardQueryParams, 'startDate' | 'endDate'>
    ) => [...privatePaddyOutwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch private paddy outward list with pagination and filters
 */
export const usePrivatePaddyOutwardList = (
    millId: string,
    params?: PrivatePaddyOutwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<PrivatePaddyOutwardListResponse, Error>({
        queryKey: privatePaddyOutwardKeys.list(millId, params),
        queryFn: () => fetchPrivatePaddyOutwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single private paddy outward entry
 */
export const usePrivatePaddyOutwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<PrivatePaddyOutwardResponse, Error>({
        queryKey: privatePaddyOutwardKeys.detail(millId, id),
        queryFn: () => fetchPrivatePaddyOutwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch private paddy outward summary/statistics
 */
export const usePrivatePaddyOutwardSummary = (
    millId: string,
    params?: Pick<PrivatePaddyOutwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<PrivatePaddyOutwardSummaryResponse, Error>({
        queryKey: privatePaddyOutwardKeys.summary(millId, params),
        queryFn: () => fetchPrivatePaddyOutwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new private paddy outward entry
 */
export const useCreatePrivatePaddyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        PrivatePaddyOutwardResponse,
        Error,
        CreatePrivatePaddyOutwardRequest
    >({
        mutationFn: (data) => createPrivatePaddyOutward(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.summaries(),
            })
            toast.success('Private paddy outward entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create private paddy outward entry'
            )
        },
    })
}

/**
 * Hook to update an existing private paddy outward entry
 */
export const useUpdatePrivatePaddyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        PrivatePaddyOutwardResponse,
        Error,
        UpdatePrivatePaddyOutwardRequest
    >({
        mutationFn: (data) => updatePrivatePaddyOutward(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                privatePaddyOutwardKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.summaries(),
            })
            toast.success('Private paddy outward entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update private paddy outward entry'
            )
        },
    })
}

/**
 * Hook to delete a private paddy outward entry
 */
export const useDeletePrivatePaddyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deletePrivatePaddyOutward(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.summaries(),
            })
            toast.success('Private paddy outward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete private paddy outward entry'
            )
        },
    })
}

/**
 * Hook to bulk delete private paddy outward entries
 */
export const useBulkDeletePrivatePaddyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeletePrivatePaddyOutward(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export private paddy outward entries
 */
export const useExportPrivatePaddyOutward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: PrivatePaddyOutwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportPrivatePaddyOutward(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `private-paddy-outward-${new Date().toISOString().split('T')[0]}.${format}`
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
