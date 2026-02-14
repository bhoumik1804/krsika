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
        mutationFn: async (data) => {
            const promise = createParty(millId, data)
            toast.promise(promise, {
                loading: 'Creating party...',
                success: 'Party created successfully',
                error: (err) => err.message || 'Failed to create party',
            })
            return promise
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: partyKeys.lists(millId),
            })
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
        mutationFn: async ({ partyId, data }) => {
            const promise = updateParty(millId, partyId, data)
            toast.promise(promise, {
                loading: 'Updating party...',
                success: 'Party updated successfully',
                error: (err) => err.message || 'Failed to update party',
            })
            return promise
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: partyKeys.lists(millId),
            })
        },
    })
}

/**
 * Hook to delete a party
 */
export const useDeleteParty = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: async (partyId) => {
            const promise = deleteParty(millId, partyId)
            toast.promise(promise, {
                loading: 'Deleting party...',
                success: 'Party deleted successfully',
                error: (err) => err.message || 'Failed to delete party',
            })
            return promise
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: partyKeys.lists(millId),
            })
        },
    })
}

/**
 * Hook to bulk delete parties
 */
export const useBulkDeleteParties = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: async (partyIds) => {
            const promise = bulkDeleteParties(millId, partyIds)
            toast.promise(promise, {
                loading: `Deleting ${partyIds.length} part${partyIds.length > 1 ? 'ies' : 'y'}...`,
                success: `${partyIds.length} part${partyIds.length > 1 ? 'ies' : 'y'} deleted successfully`,
                error: (err) => err.message || 'Failed to delete parties',
            })
            return promise
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: partyKeys.lists(millId),
            })
        },
    })
}
