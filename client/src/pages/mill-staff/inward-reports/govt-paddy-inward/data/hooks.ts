import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as govtPaddyInwardService from './service'
import type {
    CreateGovtPaddyInwardRequest,
    GovtPaddyInwardQueryParams,
    UpdateGovtPaddyInwardRequest,
} from './types'

// Query Keys
export const govtPaddyInwardKeys = {
    all: (millId: string) => ['govt-paddy-inward', millId] as const,
    lists: (millId: string) =>
        [...govtPaddyInwardKeys.all(millId), 'list'] as const,
    list: (millId: string, params: GovtPaddyInwardQueryParams) =>
        [...govtPaddyInwardKeys.lists(millId), params] as const,
    summary: (millId: string) =>
        [...govtPaddyInwardKeys.all(millId), 'summary'] as const,
}

/**
 * Hook to fetch govt paddy inward list
 */
export function useGovtPaddyInwardList(
    millId: string,
    params: GovtPaddyInwardQueryParams = {}
) {
    return useQuery({
        queryKey: govtPaddyInwardKeys.list(millId, params),
        queryFn: () =>
            govtPaddyInwardService.fetchGovtPaddyInwardList(millId, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

/**
 * Hook to fetch govt paddy inward summary
 */
export function useGovtPaddyInwardSummary(
    millId: string,
    params: Pick<GovtPaddyInwardQueryParams, 'startDate' | 'endDate'> = {}
) {
    return useQuery({
        queryKey: govtPaddyInwardKeys.summary(millId),
        queryFn: () =>
            govtPaddyInwardService.fetchGovtPaddyInwardSummary(millId, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

/**
 * Hook to create govt paddy inward entry
 */
export function useCreateGovtPaddyInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateGovtPaddyInwardRequest) =>
            govtPaddyInwardService.createGovtPaddyInward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.summary(millId),
            })
            toast.success('Govt paddy inward entry created successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to create govt paddy inward entry'
            )
        },
    })
}

/**
 * Hook to update govt paddy inward entry
 */
export function useUpdateGovtPaddyInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateGovtPaddyInwardRequest
        }) => govtPaddyInwardService.updateGovtPaddyInward(millId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.summary(millId),
            })
            toast.success('Govt paddy inward entry updated successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to update govt paddy inward entry'
            )
        },
    })
}

/**
 * Hook to delete govt paddy inward entry
 */
export function useDeleteGovtPaddyInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) =>
            govtPaddyInwardService.deleteGovtPaddyInward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.summary(millId),
            })
            toast.success('Govt paddy inward entry deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete govt paddy inward entry'
            )
        },
    })
}

/**
 * Hook to bulk delete govt paddy inward entries
 */
export function useBulkDeleteGovtPaddyInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) =>
            govtPaddyInwardService.bulkDeleteGovtPaddyInward(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: govtPaddyInwardKeys.summary(millId),
            })
            toast.success('Govt paddy inward entries deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete govt paddy inward entries'
            )
        },
    })
}
