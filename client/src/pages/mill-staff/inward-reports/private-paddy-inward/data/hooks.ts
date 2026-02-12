import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as privatePaddyInwardService from './service'
import type {
    CreatePrivatePaddyInwardRequest,
    PrivatePaddyInwardQueryParams,
    UpdatePrivatePaddyInwardRequest,
} from './types'

// Query Keys
export const privatePaddyInwardKeys = {
    all: (millId: string) => ['private-paddy-inward', millId] as const,
    lists: (millId: string) =>
        [...privatePaddyInwardKeys.all(millId), 'list'] as const,
    list: (millId: string, params: PrivatePaddyInwardQueryParams) =>
        [...privatePaddyInwardKeys.lists(millId), params] as const,
    summary: (millId: string) =>
        [...privatePaddyInwardKeys.all(millId), 'summary'] as const,
}

/**
 * Hook to fetch private paddy inward list
 */
export function usePrivatePaddyInwardList(
    millId: string,
    params: PrivatePaddyInwardQueryParams = {}
) {
    return useQuery({
        queryKey: privatePaddyInwardKeys.list(millId, params),
        queryFn: () =>
            privatePaddyInwardService.fetchPrivatePaddyInwardList(
                millId,
                params
            ),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

/**
 * Hook to fetch private paddy inward summary
 */
export function usePrivatePaddyInwardSummary(
    millId: string,
    params: Pick<PrivatePaddyInwardQueryParams, 'startDate' | 'endDate'> = {}
) {
    return useQuery({
        queryKey: privatePaddyInwardKeys.summary(millId),
        queryFn: () =>
            privatePaddyInwardService.fetchPrivatePaddyInwardSummary(
                millId,
                params
            ),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

/**
 * Hook to create private paddy inward entry
 */
export function useCreatePrivatePaddyInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreatePrivatePaddyInwardRequest) =>
            privatePaddyInwardService.createPrivatePaddyInward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.summary(millId),
            })
            toast.success('Private paddy inward entry created successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to create private paddy inward entry'
            )
        },
    })
}

/**
 * Hook to update private paddy inward entry
 */
export function useUpdatePrivatePaddyInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdatePrivatePaddyInwardRequest
        }) =>
            privatePaddyInwardService.updatePrivatePaddyInward(
                millId,
                id,
                data
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.summary(millId),
            })
            toast.success('Private paddy inward entry updated successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to update private paddy inward entry'
            )
        },
    })
}

/**
 * Hook to delete private paddy inward entry
 */
export function useDeletePrivatePaddyInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) =>
            privatePaddyInwardService.deletePrivatePaddyInward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.summary(millId),
            })
            toast.success('Private paddy inward entry deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete private paddy inward entry'
            )
        },
    })
}

/**
 * Hook to bulk delete private paddy inward entries
 */
export function useBulkDeletePrivatePaddyInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) =>
            privatePaddyInwardService.bulkDeletePrivatePaddyInward(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: privatePaddyInwardKeys.summary(millId),
            })
            toast.success('Private paddy inward entries deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete private paddy inward entries'
            )
        },
    })
}
