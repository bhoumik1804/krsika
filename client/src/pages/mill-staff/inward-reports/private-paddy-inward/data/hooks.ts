/**
 * Private Paddy Inward Hooks
 * React Query hooks for Private Paddy Inward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchPrivatePaddyInwardList,
    fetchPrivatePaddyInwardById,
    fetchPrivatePaddyInwardSummary,
    createPrivatePaddyInward,
    updatePrivatePaddyInward,
    deletePrivatePaddyInward,
    bulkDeletePrivatePaddyInward,
    exportPrivatePaddyInward,
} from './service'
import type {
    PrivatePaddyInwardResponse,
    PrivatePaddyInwardListResponse,
    PrivatePaddyInwardSummaryResponse,
    CreatePrivatePaddyInwardRequest,
    UpdatePrivatePaddyInwardRequest,
    PrivatePaddyInwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const privatePaddyInwardKeys = {
    all: ['private-paddy-inward'] as const,
    lists: () => [...privatePaddyInwardKeys.all, 'list'] as const,
    list: (millId: string, params?: PrivatePaddyInwardQueryParams) =>
        [...privatePaddyInwardKeys.lists(), millId, params] as const,
    details: () => [...privatePaddyInwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...privatePaddyInwardKeys.details(), millId, id] as const,
    summaries: () => [...privatePaddyInwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<PrivatePaddyInwardQueryParams, 'startDate' | 'endDate'>
    ) => [...privatePaddyInwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch private paddy inward list with pagination and filters
 */
export const usePrivatePaddyInwardList = (
    millId: string,
    params?: PrivatePaddyInwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<PrivatePaddyInwardListResponse, Error>({
        queryKey: privatePaddyInwardKeys.list(millId, params),
        queryFn: () => fetchPrivatePaddyInwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single private paddy inward entry
 */
export const usePrivatePaddyInwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<PrivatePaddyInwardResponse, Error>({
        queryKey: privatePaddyInwardKeys.detail(millId, id),
        queryFn: () => fetchPrivatePaddyInwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch private paddy inward summary/statistics
 */
export const usePrivatePaddyInwardSummary = (
    millId: string,
    params?: Pick<PrivatePaddyInwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<PrivatePaddyInwardSummaryResponse, Error>({
        queryKey: privatePaddyInwardKeys.summary(millId, params),
        queryFn: () => fetchPrivatePaddyInwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new private paddy inward entry
 */
export const useCreatePrivatePaddyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        PrivatePaddyInwardResponse,
        Error,
        CreatePrivatePaddyInwardRequest
    >({
        mutationFn: (data) => createPrivatePaddyInward(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.summaries(),
            })
            toast.success('Private paddy inward entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create private paddy inward entry'
            )
        },
    })
}

/**
 * Hook to update an existing private paddy inward entry
 */
export const useUpdatePrivatePaddyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        PrivatePaddyInwardResponse,
        Error,
        UpdatePrivatePaddyInwardRequest
    >({
        mutationFn: (data) => updatePrivatePaddyInward(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                privatePaddyInwardKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.summaries(),
            })
            toast.success('Private paddy inward entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update private paddy inward entry'
            )
        },
    })
}

/**
 * Hook to delete a private paddy inward entry
 */
export const useDeletePrivatePaddyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deletePrivatePaddyInward(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.summaries(),
            })
            toast.success('Private paddy inward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete private paddy inward entry'
            )
        },
    })
}

/**
 * Hook to bulk delete private paddy inward entries
 */
export const useBulkDeletePrivatePaddyInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeletePrivatePaddyInward(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export private paddy inward entries
 */
export const useExportPrivatePaddyInward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: PrivatePaddyInwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportPrivatePaddyInward(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `private-paddy-inward-${new Date().toISOString().split('T')[0]}.${format}`
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
