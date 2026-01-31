/**
 * Labour Outward Hooks
 * React Query hooks for Labour Outward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchLabourOutwardList,
    fetchLabourOutwardById,
    fetchLabourOutwardSummary,
    createLabourOutward,
    updateLabourOutward,
    deleteLabourOutward,
    bulkDeleteLabourOutward,
    exportLabourOutward,
} from './service'
import type {
    LabourOutwardResponse,
    LabourOutwardListResponse,
    LabourOutwardSummaryResponse,
    CreateLabourOutwardRequest,
    UpdateLabourOutwardRequest,
    LabourOutwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const labourOutwardKeys = {
    all: ['labour-outward'] as const,
    lists: () => [...labourOutwardKeys.all, 'list'] as const,
    list: (millId: string, params?: LabourOutwardQueryParams) =>
        [...labourOutwardKeys.lists(), millId, params] as const,
    details: () => [...labourOutwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...labourOutwardKeys.details(), millId, id] as const,
    summaries: () => [...labourOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<LabourOutwardQueryParams, 'startDate' | 'endDate'>
    ) => [...labourOutwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch labour outward list with pagination and filters
 */
export const useLabourOutwardList = (
    millId: string,
    params?: LabourOutwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<LabourOutwardListResponse, Error>({
        queryKey: labourOutwardKeys.list(millId, params),
        queryFn: () => fetchLabourOutwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single labour outward entry
 */
export const useLabourOutwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<LabourOutwardResponse, Error>({
        queryKey: labourOutwardKeys.detail(millId, id),
        queryFn: () => fetchLabourOutwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch labour outward summary/statistics
 */
export const useLabourOutwardSummary = (
    millId: string,
    params?: Pick<LabourOutwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<LabourOutwardSummaryResponse, Error>({
        queryKey: labourOutwardKeys.summary(millId, params),
        queryFn: () => fetchLabourOutwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new labour outward entry
 */
export const useCreateLabourOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        LabourOutwardResponse,
        Error,
        CreateLabourOutwardRequest
    >({
        mutationFn: (data) => createLabourOutward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: labourOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: labourOutwardKeys.summaries(),
            })
            toast.success('Labour outward entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create labour outward entry'
            )
        },
    })
}

/**
 * Hook to update an existing labour outward entry
 */
export const useUpdateLabourOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        LabourOutwardResponse,
        Error,
        UpdateLabourOutwardRequest
    >({
        mutationFn: (data) => updateLabourOutward(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: labourOutwardKeys.lists(),
            })
            queryClient.setQueryData(
                labourOutwardKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: labourOutwardKeys.summaries(),
            })
            toast.success('Labour outward entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update labour outward entry'
            )
        },
    })
}

/**
 * Hook to delete a labour outward entry
 */
export const useDeleteLabourOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteLabourOutward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: labourOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: labourOutwardKeys.summaries(),
            })
            toast.success('Labour outward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete labour outward entry'
            )
        },
    })
}

/**
 * Hook to bulk delete labour outward entries
 */
export const useBulkDeleteLabourOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteLabourOutward(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: labourOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: labourOutwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete labour outward entries'
            )
        },
    })
}

/**
 * Hook to export labour outward entries
 */
export const useExportLabourOutward = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: LabourOutwardQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportLabourOutward(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
