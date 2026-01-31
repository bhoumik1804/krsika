/**
 * Other Inward Hooks
 * React Query hooks for Other Inward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchOtherInwardList,
    fetchOtherInwardById,
    fetchOtherInwardSummary,
    createOtherInward,
    updateOtherInward,
    deleteOtherInward,
    bulkDeleteOtherInward,
    exportOtherInward,
} from './service'
import type {
    OtherInwardResponse,
    OtherInwardListResponse,
    OtherInwardSummaryResponse,
    CreateOtherInwardRequest,
    UpdateOtherInwardRequest,
    OtherInwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const otherInwardKeys = {
    all: ['other-inward'] as const,
    lists: () => [...otherInwardKeys.all, 'list'] as const,
    list: (millId: string, params?: OtherInwardQueryParams) =>
        [...otherInwardKeys.lists(), millId, params] as const,
    details: () => [...otherInwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...otherInwardKeys.details(), millId, id] as const,
    summaries: () => [...otherInwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<OtherInwardQueryParams, 'startDate' | 'endDate'>
    ) => [...otherInwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch other inward list with pagination and filters
 */
export const useOtherInwardList = (
    millId: string,
    params?: OtherInwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<OtherInwardListResponse, Error>({
        queryKey: otherInwardKeys.list(millId, params),
        queryFn: () => fetchOtherInwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single other inward entry
 */
export const useOtherInwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<OtherInwardResponse, Error>({
        queryKey: otherInwardKeys.detail(millId, id),
        queryFn: () => fetchOtherInwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch other inward summary/statistics
 */
export const useOtherInwardSummary = (
    millId: string,
    params?: Pick<OtherInwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<OtherInwardSummaryResponse, Error>({
        queryKey: otherInwardKeys.summary(millId, params),
        queryFn: () => fetchOtherInwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new other inward entry
 */
export const useCreateOtherInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<OtherInwardResponse, Error, CreateOtherInwardRequest>({
        mutationFn: (data) => createOtherInward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: otherInwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: otherInwardKeys.summaries(),
            })
            toast.success('Other inward entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create other inward entry')
        },
    })
}

/**
 * Hook to update an existing other inward entry
 */
export const useUpdateOtherInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<OtherInwardResponse, Error, UpdateOtherInwardRequest>({
        mutationFn: (data) => updateOtherInward(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: otherInwardKeys.lists(),
            })
            queryClient.setQueryData(
                otherInwardKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: otherInwardKeys.summaries(),
            })
            toast.success('Other inward entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update other inward entry')
        },
    })
}

/**
 * Hook to delete an other inward entry
 */
export const useDeleteOtherInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteOtherInward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: otherInwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: otherInwardKeys.summaries(),
            })
            toast.success('Other inward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete other inward entry')
        },
    })
}

/**
 * Hook to bulk delete other inward entries
 */
export const useBulkDeleteOtherInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteOtherInward(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: otherInwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: otherInwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete other inward entries'
            )
        },
    })
}

/**
 * Hook to export other inward entries
 */
export const useExportOtherInward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: OtherInwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportOtherInward(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
