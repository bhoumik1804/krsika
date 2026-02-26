/**
 * Labour Other Hooks
 * React Query hooks for Labour Other data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchLabourOtherList,
    fetchLabourOtherById,
    fetchLabourOtherSummary,
    createLabourOther,
    updateLabourOther,
    deleteLabourOther,
    bulkDeleteLabourOther,
} from './service'
import type {
    LabourOtherResponse,
    LabourOtherListResponse,
    LabourOtherSummaryResponse,
    CreateLabourOtherRequest,
    UpdateLabourOtherRequest,
    LabourOtherQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const labourOtherKeys = {
    all: ['labour-other'] as const,
    lists: () => [...labourOtherKeys.all, 'list'] as const,
    list: (millId: string, params?: LabourOtherQueryParams) =>
        [...labourOtherKeys.lists(), millId, params] as const,
    details: () => [...labourOtherKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...labourOtherKeys.details(), millId, id] as const,
    summaries: () => [...labourOtherKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<LabourOtherQueryParams, 'startDate' | 'endDate'>
    ) => [...labourOtherKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch labour other list with pagination and filters
 */
export const useLabourOtherList = (
    millId: string,
    params?: LabourOtherQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<LabourOtherListResponse, Error>({
        queryKey: labourOtherKeys.list(millId, params),
        queryFn: () => fetchLabourOtherList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single labour other entry
 */
export const useLabourOtherDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<LabourOtherResponse, Error>({
        queryKey: labourOtherKeys.detail(millId, id),
        queryFn: () => fetchLabourOtherById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch labour other summary/statistics
 */
export const useLabourOtherSummary = (
    millId: string,
    params?: Pick<LabourOtherQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<LabourOtherSummaryResponse, Error>({
        queryKey: labourOtherKeys.summary(millId, params),
        queryFn: () => fetchLabourOtherSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new labour other entry
 */
export const useCreateLabourOther = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<LabourOtherResponse, Error, CreateLabourOtherRequest>({
        mutationFn: (data) => createLabourOther(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: labourOtherKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: labourOtherKeys.summaries(),
            })
            toast.success('Labour other entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create labour other entry')
        },
    })
}

/**
 * Hook to update an existing labour other entry
 */
export const useUpdateLabourOther = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<LabourOtherResponse, Error, UpdateLabourOtherRequest>({
        mutationFn: (data) => updateLabourOther(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: labourOtherKeys.lists(),
            })
            queryClient.setQueryData(
                labourOtherKeys.detail(millId, data._id as string),
                data
            )
            queryClient.invalidateQueries({
                queryKey: labourOtherKeys.summaries(),
            })
            toast.success('Labour other entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update labour other entry')
        },
    })
}

/**
 * Hook to delete a labour other entry
 */
export const useDeleteLabourOther = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteLabourOther(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: labourOtherKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: labourOtherKeys.summaries(),
            })
            toast.success('Labour other entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete labour other entry')
        },
    })
}

/**
 * Hook to bulk delete labour other entries
 */
export const useBulkDeleteLabourOther = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteLabourOther(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: labourOtherKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: labourOtherKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete labour other entries'
            )
        },
    })
}
