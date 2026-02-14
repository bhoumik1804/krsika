/**
 * Party Report Hooks
 * React Query hooks for Party data management (Mill Admin)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { PartyReportData } from './schema'
import {
    fetchPartyList,
    createParty,
    updateParty,
    deleteParty,
    bulkDeleteParties,
    type PartyListResponse,
    type PartyQueryParams,
} from './service'

// Re-export types
export type { PartyQueryParams, PartyListResponse }

// ==========================================
// Query Keys
// ==========================================

export const partyKeys = {
    all: (millId: string) => ['party', millId] as const,
    lists: (millId: string) => [...partyKeys.all(millId), 'list'] as const,
    list: (millId: string, params?: PartyQueryParams) =>
        [...partyKeys.lists(millId), params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch parties list with pagination and filters
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

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new party
 */
export const useCreateParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<PartyReportData, Error, Partial<PartyReportData>>({
        mutationFn: (data) => createParty(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: partyKeys.lists(millId),
            })
            toast.success('Party created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create party')
        },
    })
}

/**
 * Hook to update a party
 */
export const useUpdateParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        PartyReportData,
        Error,
        { partyId: string; data: Partial<PartyReportData> }
    >({
        mutationFn: ({ partyId, data }) => updateParty(millId, partyId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: partyKeys.lists(millId),
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
        mutationFn: (partyId) => deleteParty(millId, partyId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: partyKeys.lists(millId),
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
export const useBulkDeleteParties = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (partyIds) => bulkDeleteParties(millId, partyIds),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: partyKeys.lists(millId),
            })
            toast.success('Parties deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete parties')
        },
    })
}
