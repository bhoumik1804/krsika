import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as riceInwardService from './service'
import type {
    RiceInwardQueryParams,
    CreateRiceInwardRequest,
    UpdateRiceInwardRequest,
} from './types'

// Query Keys
export const riceInwardKeys = {
    all: (millId: string) => ['rice-inward', millId] as const,
    lists: (millId: string) => [...riceInwardKeys.all(millId), 'list'] as const,
    list: (millId: string, params: RiceInwardQueryParams) =>
        [...riceInwardKeys.lists(millId), params] as const,
    summary: (millId: string) =>
        [...riceInwardKeys.all(millId), 'summary'] as const,
}

/**
 * Hook to fetch rice inward list
 */
export function useRiceInwardList(
    millId: string,
    params: RiceInwardQueryParams = {}
) {
    return useQuery({
        queryKey: riceInwardKeys.list(millId, params),
        queryFn: () => riceInwardService.fetchRiceInwardList(millId, params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

/**
 * Hook to fetch rice inward summary
 */
export function useRiceInwardSummary(millId: string) {
    return useQuery({
        queryKey: riceInwardKeys.summary(millId),
        queryFn: () => riceInwardService.fetchRiceInwardSummary(millId),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

/**
 * Hook to create rice inward entry
 */
export function useCreateRiceInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateRiceInwardRequest) =>
            riceInwardService.createRiceInward(millId, data),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.summary(millId),
            })
            toast.success('Rice inward entry created successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create rice inward entry')
        },
    })
}

/**
 * Hook to update rice inward entry
 */
export function useUpdateRiceInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateRiceInwardRequest
        }) => riceInwardService.updateRiceInward(millId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.summary(millId),
            })
            toast.success('Rice inward entry updated successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update rice inward entry')
        },
    })
}

/**
 * Hook to delete rice inward entry
 */
export function useDeleteRiceInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) =>
            riceInwardService.deleteRiceInward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.summary(millId),
            })
            toast.success('Rice inward entry deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete rice inward entry')
        },
    })
}

/**
 * Hook to bulk delete rice inward entries
 */
export function useBulkDeleteRiceInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) =>
            riceInwardService.bulkDeleteRiceInward(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: riceInwardKeys.summary(millId),
            })
            toast.success('Rice inward entries deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete rice inward entries')
        },
    })
}
