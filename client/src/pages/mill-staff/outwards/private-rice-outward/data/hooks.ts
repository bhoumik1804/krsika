/**
 * Private Rice Outward Hooks
 * React Query hooks for Private Rice Outward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchPrivateRiceOutwardList,
    fetchPrivateRiceOutwardById,
    fetchPrivateRiceOutwardSummary,
    createPrivateRiceOutward,
    updatePrivateRiceOutward,
    deletePrivateRiceOutward,
    bulkDeletePrivateRiceOutward,
    exportPrivateRiceOutward,
} from './service'
import type {
    PrivateRiceOutwardResponse,
    PrivateRiceOutwardListResponse,
    PrivateRiceOutwardSummaryResponse,
    CreatePrivateRiceOutwardRequest,
    UpdatePrivateRiceOutwardRequest,
    PrivateRiceOutwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const privateRiceOutwardKeys = {
    all: ['private-rice-outward'] as const,
    lists: () => [...privateRiceOutwardKeys.all, 'list'] as const,
    list: (millId: string, params?: PrivateRiceOutwardQueryParams) =>
        [...privateRiceOutwardKeys.lists(), millId, params] as const,
    details: () => [...privateRiceOutwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...privateRiceOutwardKeys.details(), millId, id] as const,
    summaries: () => [...privateRiceOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<PrivateRiceOutwardQueryParams, 'startDate' | 'endDate'>
    ) => [...privateRiceOutwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch private rice outward list with pagination and filters
 */
export const usePrivateRiceOutwardList = (
    millId: string,
    params?: PrivateRiceOutwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<PrivateRiceOutwardListResponse, Error>({
        queryKey: privateRiceOutwardKeys.list(millId, params),
        queryFn: () => fetchPrivateRiceOutwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single private rice outward entry
 */
export const usePrivateRiceOutwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<PrivateRiceOutwardResponse, Error>({
        queryKey: privateRiceOutwardKeys.detail(millId, id),
        queryFn: () => fetchPrivateRiceOutwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch private rice outward summary/statistics
 */
export const usePrivateRiceOutwardSummary = (
    millId: string,
    params?: Pick<PrivateRiceOutwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<PrivateRiceOutwardSummaryResponse, Error>({
        queryKey: privateRiceOutwardKeys.summary(millId, params),
        queryFn: () => fetchPrivateRiceOutwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new private rice outward entry
 */
export const useCreatePrivateRiceOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        PrivateRiceOutwardResponse,
        Error,
        CreatePrivateRiceOutwardRequest
    >({
        mutationFn: (data) => createPrivateRiceOutward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.summaries(),
            })
            toast.success('Private rice outward entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create private rice outward entry'
            )
        },
    })
}

/**
 * Hook to update an existing private rice outward entry
 */
export const useUpdatePrivateRiceOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        PrivateRiceOutwardResponse,
        Error,
        UpdatePrivateRiceOutwardRequest
    >({
        mutationFn: (data) => updatePrivateRiceOutward(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.lists(),
            })
            queryClient.setQueryData(
                privateRiceOutwardKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.summaries(),
            })
            toast.success('Private rice outward entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update private rice outward entry'
            )
        },
    })
}

/**
 * Hook to delete a private rice outward entry
 */
export const useDeletePrivateRiceOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deletePrivateRiceOutward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.summaries(),
            })
            toast.success('Private rice outward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete private rice outward entry'
            )
        },
    })
}

/**
 * Hook to bulk delete private rice outward entries
 */
export const useBulkDeletePrivateRiceOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeletePrivateRiceOutward(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete private rice outward entries'
            )
        },
    })
}

/**
 * Hook to export private rice outward entries
 */
export const useExportPrivateRiceOutward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: PrivateRiceOutwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportPrivateRiceOutward(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
