import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as privatePaddyOutwardService from './service'
import type {
    CreatePrivatePaddyOutwardRequest,
    PrivatePaddyOutwardQueryParams,
    UpdatePrivatePaddyOutwardRequest,
} from './types'

// Query Keys
export const privatePaddyOutwardKeys = {
    all: (millId: string) => ['private-paddy-outward', millId] as const,
    lists: (millId: string) =>
        [...privatePaddyOutwardKeys.all(millId), 'list'] as const,
    list: (millId: string, params: PrivatePaddyOutwardQueryParams) =>
        [...privatePaddyOutwardKeys.lists(millId), params] as const,
    summary: (millId: string) =>
        [...privatePaddyOutwardKeys.all(millId), 'summary'] as const,
}

/**
 * Hook to fetch private paddy outward list
 */
export function usePrivatePaddyOutwardList(
    millId: string,
    params: PrivatePaddyOutwardQueryParams = {}
) {
    return useQuery({
        queryKey: privatePaddyOutwardKeys.list(millId, params),
        queryFn: () =>
            privatePaddyOutwardService.fetchPrivatePaddyOutwardList(
                millId,
                params
            ),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

/**
 * Hook to fetch private paddy outward summary
 */
export function usePrivatePaddyOutwardSummary(
    millId: string,
    params: Pick<PrivatePaddyOutwardQueryParams, 'startDate' | 'endDate'> = {}
) {
    return useQuery({
        queryKey: privatePaddyOutwardKeys.summary(millId),
        queryFn: () =>
            privatePaddyOutwardService.fetchPrivatePaddyOutwardSummary(
                millId,
                params
            ),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

/**
 * Hook to create private paddy outward entry
 */
export function useCreatePrivatePaddyOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreatePrivatePaddyOutwardRequest) =>
            privatePaddyOutwardService.createPrivatePaddyOutward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.summary(millId),
            })
            toast.success('Private paddy outward entry created successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to create private paddy outward entry'
            )
        },
    })
}

/**
 * Hook to update private paddy outward entry
 */
export function useUpdatePrivatePaddyOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdatePrivatePaddyOutwardRequest
        }) =>
            privatePaddyOutwardService.updatePrivatePaddyOutward(
                millId,
                id,
                data
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.summary(millId),
            })
            toast.success('Private paddy outward entry updated successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to update private paddy outward entry'
            )
        },
    })
}

/**
 * Hook to delete private paddy outward entry
 */
export function useDeletePrivatePaddyOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) =>
            privatePaddyOutwardService.deletePrivatePaddyOutward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.summary(millId),
            })
            toast.success('Private paddy outward entry deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete private paddy outward entry'
            )
        },
    })
}

/**
 * Hook to bulk delete private paddy outward entries
 */
export function useBulkDeletePrivatePaddyOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) =>
            privatePaddyOutwardService.bulkDeletePrivatePaddyOutward(
                millId,
                ids
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: privatePaddyOutwardKeys.summary(millId),
            })
            toast.success('Private paddy outward entries deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message ||
                    'Failed to delete private paddy outward entries'
            )
        },
    })
}
