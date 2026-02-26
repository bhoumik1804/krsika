/**
 * Labour Milling Hooks
 * React Query hooks for Labour Milling data management
 */
import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchLabourMillingList,
    fetchLabourMillingById,
    fetchLabourMillingSummary,
    createLabourMilling,
    updateLabourMilling,
    deleteLabourMilling,
    bulkDeleteLabourMilling,
} from './service'
import type {
    LabourMillingResponse,
    LabourMillingListResponse,
    LabourMillingSummaryResponse,
    CreateLabourMillingRequest,
    UpdateLabourMillingRequest,
    LabourMillingQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const labourMillingKeys = {
    all: ['labour-milling'] as const,
    lists: () => [...labourMillingKeys.all, 'list'] as const,
    list: (millId: string, params?: LabourMillingQueryParams) =>
        [...labourMillingKeys.lists(), millId, params] as const,
    details: () => [...labourMillingKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...labourMillingKeys.details(), millId, id] as const,
    summaries: () => [...labourMillingKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<LabourMillingQueryParams, 'startDate' | 'endDate'>
    ) => [...labourMillingKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch labour milling list with pagination and filters
 */
export const useLabourMillingList = (
    millId: string,
    params?: LabourMillingQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<LabourMillingListResponse, Error>({
        queryKey: labourMillingKeys.list(millId, params),
        queryFn: () => fetchLabourMillingList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: keepPreviousData,
    })
}

/**
 * Hook to fetch a single labour milling entry
 */
export const useLabourMillingDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<LabourMillingResponse, Error>({
        queryKey: labourMillingKeys.detail(millId, id),
        queryFn: () => fetchLabourMillingById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch labour milling summary/statistics
 */
export const useLabourMillingSummary = (
    millId: string,
    params?: Pick<LabourMillingQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<LabourMillingSummaryResponse, Error>({
        queryKey: labourMillingKeys.summary(millId, params),
        queryFn: () => fetchLabourMillingSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new labour milling entry
 */
export const useCreateLabourMilling = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        LabourMillingResponse,
        Error,
        CreateLabourMillingRequest
    >({
        mutationFn: (data) => createLabourMilling(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: labourMillingKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: labourMillingKeys.summaries(),
            })
            toast.success('Labour milling entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create labour milling entry'
            )
        },
    })
}

/**
 * Hook to update an existing labour milling entry
 */
export const useUpdateLabourMilling = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        LabourMillingResponse,
        Error,
        UpdateLabourMillingRequest
    >({
        mutationFn: (data) => updateLabourMilling(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: labourMillingKeys.lists(),
            })
            queryClient.setQueryData(
                labourMillingKeys.detail(millId, data._id as string),
                data
            )
            queryClient.invalidateQueries({
                queryKey: labourMillingKeys.summaries(),
            })
            toast.success('Labour milling entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update labour milling entry'
            )
        },
    })
}

/**
 * Hook to delete a labour milling entry
 */
export const useDeleteLabourMilling = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteLabourMilling(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: labourMillingKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: labourMillingKeys.summaries(),
            })
            toast.success('Labour milling entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete labour milling entry'
            )
        },
    })
}

/**
 * Hook to bulk delete labour milling entries
 */
export const useBulkDeleteLabourMilling = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteLabourMilling(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: labourMillingKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: labourMillingKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete labour milling entries'
            )
        },
    })
}
