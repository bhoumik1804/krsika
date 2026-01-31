/**
 * Committee Report Hooks
 * React Query hooks for Committee data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchCommitteeList,
    fetchCommitteeById,
    fetchCommitteeSummary,
    createCommittee,
    updateCommittee,
    deleteCommittee,
    bulkDeleteCommittee,
    exportCommittee,
} from './service'
import type {
    CommitteeResponse,
    CommitteeListResponse,
    CommitteeSummaryResponse,
    CreateCommitteeRequest,
    UpdateCommitteeRequest,
    CommitteeQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const committeeKeys = {
    all: ['committee'] as const,
    lists: () => [...committeeKeys.all, 'list'] as const,
    list: (millId: string, params?: CommitteeQueryParams) =>
        [...committeeKeys.lists(), millId, params] as const,
    details: () => [...committeeKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...committeeKeys.details(), millId, id] as const,
    summaries: () => [...committeeKeys.all, 'summary'] as const,
    summary: (millId: string) =>
        [...committeeKeys.summaries(), millId] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch committee list with pagination and filters
 */
export const useCommitteeList = (
    millId: string,
    params?: CommitteeQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<CommitteeListResponse, Error>({
        queryKey: committeeKeys.list(millId, params),
        queryFn: () => fetchCommitteeList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single committee
 */
export const useCommitteeDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<CommitteeResponse, Error>({
        queryKey: committeeKeys.detail(millId, id),
        queryFn: () => fetchCommitteeById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch committee summary/statistics
 */
export const useCommitteeSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<CommitteeSummaryResponse, Error>({
        queryKey: committeeKeys.summary(millId),
        queryFn: () => fetchCommitteeSummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new committee
 */
export const useCreateCommittee = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<CommitteeResponse, Error, CreateCommitteeRequest>({
        mutationFn: (data) => createCommittee(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: committeeKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: committeeKeys.summaries(),
            })
            toast.success('Committee created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create committee')
        },
    })
}

/**
 * Hook to update an existing committee
 */
export const useUpdateCommittee = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<CommitteeResponse, Error, UpdateCommitteeRequest>({
        mutationFn: (data) => updateCommittee(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: committeeKeys.lists(),
            })
            queryClient.setQueryData(
                committeeKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: committeeKeys.summaries(),
            })
            toast.success('Committee updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update committee')
        },
    })
}

/**
 * Hook to delete a committee
 */
export const useDeleteCommittee = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteCommittee(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: committeeKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: committeeKeys.summaries(),
            })
            toast.success('Committee deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete committee')
        },
    })
}

/**
 * Hook to bulk delete committees
 */
export const useBulkDeleteCommittee = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteCommittee(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: committeeKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: committeeKeys.summaries(),
            })
            toast.success(`${ids.length} committees deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete committees')
        },
    })
}

/**
 * Hook to export committees
 */
export const useExportCommittee = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: CommitteeQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportCommittee(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
