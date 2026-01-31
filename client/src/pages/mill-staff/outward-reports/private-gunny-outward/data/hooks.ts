/**
 * Private Gunny Outward Hooks
 * React Query hooks for Private Gunny Outward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchPrivateGunnyOutwardList,
    fetchPrivateGunnyOutwardById,
    fetchPrivateGunnyOutwardSummary,
    createPrivateGunnyOutward,
    updatePrivateGunnyOutward,
    deletePrivateGunnyOutward,
    bulkDeletePrivateGunnyOutward,
    exportPrivateGunnyOutward,
} from './service'
import type {
    PrivateGunnyOutwardResponse,
    PrivateGunnyOutwardListResponse,
    PrivateGunnyOutwardSummaryResponse,
    CreatePrivateGunnyOutwardRequest,
    UpdatePrivateGunnyOutwardRequest,
    PrivateGunnyOutwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const privateGunnyOutwardKeys = {
    all: ['private-gunny-outward'] as const,
    lists: () => [...privateGunnyOutwardKeys.all, 'list'] as const,
    list: (millId: string, params?: PrivateGunnyOutwardQueryParams) =>
        [...privateGunnyOutwardKeys.lists(), millId, params] as const,
    details: () => [...privateGunnyOutwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...privateGunnyOutwardKeys.details(), millId, id] as const,
    summaries: () => [...privateGunnyOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<PrivateGunnyOutwardQueryParams, 'startDate' | 'endDate'>
    ) => [...privateGunnyOutwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch private gunny outward list with pagination and filters
 */
export const usePrivateGunnyOutwardList = (
    millId: string,
    params?: PrivateGunnyOutwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<PrivateGunnyOutwardListResponse, Error>({
        queryKey: privateGunnyOutwardKeys.list(millId, params),
        queryFn: () => fetchPrivateGunnyOutwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single private gunny outward entry
 */
export const usePrivateGunnyOutwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<PrivateGunnyOutwardResponse, Error>({
        queryKey: privateGunnyOutwardKeys.detail(millId, id),
        queryFn: () => fetchPrivateGunnyOutwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch private gunny outward summary/statistics
 */
export const usePrivateGunnyOutwardSummary = (
    millId: string,
    params?: Pick<PrivateGunnyOutwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<PrivateGunnyOutwardSummaryResponse, Error>({
        queryKey: privateGunnyOutwardKeys.summary(millId, params),
        queryFn: () => fetchPrivateGunnyOutwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new private gunny outward entry
 */
export const useCreatePrivateGunnyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        PrivateGunnyOutwardResponse,
        Error,
        CreatePrivateGunnyOutwardRequest
    >({
        mutationFn: (data) => createPrivateGunnyOutward(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.summaries(),
            })
            toast.success('Private gunny outward entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create private gunny outward entry'
            )
        },
    })
}

/**
 * Hook to update an existing private gunny outward entry
 */
export const useUpdatePrivateGunnyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        PrivateGunnyOutwardResponse,
        Error,
        UpdatePrivateGunnyOutwardRequest
    >({
        mutationFn: (data) => updatePrivateGunnyOutward(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(
                privateGunnyOutwardKeys.detail(millId, data._id),
                data
            )
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.summaries(),
            })
            toast.success('Private gunny outward entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update private gunny outward entry'
            )
        },
    })
}

/**
 * Hook to delete a private gunny outward entry
 */
export const useDeletePrivateGunnyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deletePrivateGunnyOutward(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.summaries(),
            })
            toast.success('Private gunny outward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete private gunny outward entry'
            )
        },
    })
}

/**
 * Hook to bulk delete private gunny outward entries
 */
export const useBulkDeletePrivateGunnyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeletePrivateGunnyOutward(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete entries')
        },
    })
}

/**
 * Hook to export private gunny outward entries
 */
export const useExportPrivateGunnyOutward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: PrivateGunnyOutwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportPrivateGunnyOutward(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `private-gunny-outward-${new Date().toISOString().split('T')[0]}.${format}`
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
