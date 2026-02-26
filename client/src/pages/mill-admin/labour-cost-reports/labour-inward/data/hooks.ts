/**
 * Labour Inward Hooks
 * React Query hooks for Labour Inward data management
 */
import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchLabourInwardList,
    fetchLabourInwardById,
    fetchLabourInwardSummary,
    createLabourInward,
    updateLabourInward,
    deleteLabourInward,
    bulkDeleteLabourInward,
} from './service'
import type {
    LabourInwardResponse,
    LabourInwardListResponse,
    LabourInwardSummaryResponse,
    CreateLabourInwardRequest,
    UpdateLabourInwardRequest,
    LabourInwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const labourInwardKeys = {
    all: ['labour-inward'] as const,
    lists: () => [...labourInwardKeys.all, 'list'] as const,
    list: (millId: string, params?: LabourInwardQueryParams) =>
        [...labourInwardKeys.lists(), millId, params] as const,
    details: () => [...labourInwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...labourInwardKeys.details(), millId, id] as const,
    summaries: () => [...labourInwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<LabourInwardQueryParams, 'startDate' | 'endDate'>
    ) => [...labourInwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch labour inward list with pagination and filters
 */
export const useLabourInwardList = (
    millId: string,
    params?: LabourInwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<LabourInwardListResponse, Error>({
        queryKey: labourInwardKeys.list(millId, params),
        queryFn: () => fetchLabourInwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: keepPreviousData,
    })
}

/**
 * Hook to fetch a single labour inward entry
 */
export const useLabourInwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<LabourInwardResponse, Error>({
        queryKey: labourInwardKeys.detail(millId, id),
        queryFn: () => fetchLabourInwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch labour inward summary/statistics
 */
export const useLabourInwardSummary = (
    millId: string,
    params?: Pick<LabourInwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<LabourInwardSummaryResponse, Error>({
        queryKey: labourInwardKeys.summary(millId, params),
        queryFn: () => fetchLabourInwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new labour inward entry
 */
export const useCreateLabourInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<LabourInwardResponse, Error, CreateLabourInwardRequest>({
        mutationFn: (data) => createLabourInward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: labourInwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: labourInwardKeys.summaries(),
            })
            toast.success('Labour inward entry created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create labour inward entry')
        },
    })
}

/**
 * Hook to update an existing labour inward entry
 */
export const useUpdateLabourInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<LabourInwardResponse, Error, UpdateLabourInwardRequest>({
        mutationFn: (data) => updateLabourInward(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: labourInwardKeys.lists(),
            })
            queryClient.setQueryData(
                labourInwardKeys.detail(millId, data._id as string),
                data
            )
            queryClient.invalidateQueries({
                queryKey: labourInwardKeys.summaries(),
            })
            toast.success('Labour inward entry updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update labour inward entry')
        },
    })
}

/**
 * Hook to delete a labour inward entry
 */
export const useDeleteLabourInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteLabourInward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: labourInwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: labourInwardKeys.summaries(),
            })
            toast.success('Labour inward entry deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete labour inward entry')
        },
    })
}

/**
 * Hook to bulk delete labour inward entries
 */
export const useBulkDeleteLabourInward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteLabourInward(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: labourInwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: labourInwardKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete labour inward entries'
            )
        },
    })
}
