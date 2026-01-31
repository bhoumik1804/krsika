/**
 * Party Report Hooks
 * React Query hooks for Party data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchPartyList,
    fetchPartyById,
    fetchPartySummary,
    createParty,
    updateParty,
    deleteParty,
    bulkDeleteParty,
    exportParty,
} from './service'
import type {
    PartyResponse,
    PartyListResponse,
    PartySummaryResponse,
    CreatePartyRequest,
    UpdatePartyRequest,
    PartyQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const partyKeys = {
    all: ['party'] as const,
    lists: () => [...partyKeys.all, 'list'] as const,
    list: (millId: string, params?: PartyQueryParams) =>
        [...partyKeys.lists(), millId, params] as const,
    details: () => [...partyKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...partyKeys.details(), millId, id] as const,
    summaries: () => [...partyKeys.all, 'summary'] as const,
    summary: (millId: string) => [...partyKeys.summaries(), millId] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch party list with pagination and filters
 */
export const usePartyList = (
    millId: string,
    params?: PartyQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<PartyListResponse, Error>({
        queryKey: partyKeys.list(millId, params),
        queryFn: () => fetchPartyList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single party
 */
export const usePartyDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<PartyResponse, Error>({
        queryKey: partyKeys.detail(millId, id),
        queryFn: () => fetchPartyById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch party summary/statistics
 */
export const usePartySummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<PartySummaryResponse, Error>({
        queryKey: partyKeys.summary(millId),
        queryFn: () => fetchPartySummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new party
 */
export const useCreateParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<PartyResponse, Error, CreatePartyRequest>({
        mutationFn: (data) => createParty(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: partyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: partyKeys.summaries(),
            })
            toast.success('Party created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create party')
        },
    })
}

/**
 * Hook to update an existing party
 */
export const useUpdateParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<PartyResponse, Error, UpdatePartyRequest>({
        mutationFn: (data) => updateParty(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: partyKeys.lists(),
            })
            queryClient.setQueryData(partyKeys.detail(millId, data._id), data)
            queryClient.invalidateQueries({
                queryKey: partyKeys.summaries(),
            })
            toast.success('Party updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update party')
        },
    })
}

/**
 * Hook to delete a party
 */
export const useDeleteParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteParty(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: partyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: partyKeys.summaries(),
            })
            toast.success('Party deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete party')
        },
    })
}

/**
 * Hook to bulk delete parties
 */
export const useBulkDeleteParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteParty(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: partyKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: partyKeys.summaries(),
            })
            toast.success(`${ids.length} parties deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete parties')
        },
    })
}

/**
 * Hook to export parties
 */
export const useExportParty = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: PartyQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) => exportParty(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
