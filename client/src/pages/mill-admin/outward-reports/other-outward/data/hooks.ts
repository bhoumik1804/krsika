import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as otherOutwardService from './service'
import type {
    CreateOtherOutwardRequest,
    OtherOutwardQueryParams,
    UpdateOtherOutwardRequest,
} from './types'

export const otherOutwardKeys = {
    all: (millId: string) => ['other-outward', millId] as const,
    lists: (millId: string) =>
        [...otherOutwardKeys.all(millId), 'list'] as const,
    list: (millId: string, params: OtherOutwardQueryParams) =>
        [...otherOutwardKeys.lists(millId), params] as const,
    summary: (millId: string) =>
        [...otherOutwardKeys.all(millId), 'summary'] as const,
}

export function useOtherOutwardList(
    millId: string,
    params: OtherOutwardQueryParams = {}
) {
    return useQuery({
        queryKey: otherOutwardKeys.list(millId, params),
        queryFn: () =>
            otherOutwardService.fetchOtherOutwardList(millId, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

export function useOtherOutwardSummary(
    millId: string,
    params: Pick<OtherOutwardQueryParams, 'startDate' | 'endDate'> = {}
) {
    return useQuery({
        queryKey: otherOutwardKeys.summary(millId),
        queryFn: () =>
            otherOutwardService.fetchOtherOutwardSummary(millId, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

export function useCreateOtherOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateOtherOutwardRequest) =>
            otherOutwardService.createOtherOutward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.summary(millId),
            })
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create other outward entry')
        },
    })
}

export function useUpdateOtherOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateOtherOutwardRequest
        }) => otherOutwardService.updateOtherOutward(millId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.summary(millId),
            })
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update other outward entry')
        },
    })
}

export function useDeleteOtherOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) =>
            otherOutwardService.deleteOtherOutward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.summary(millId),
            })
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete other outward entry')
        },
    })
}

export function useBulkDeleteOtherOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) =>
            otherOutwardService.bulkDeleteOtherOutward(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: otherOutwardKeys.summary(millId),
            })
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete other outward entries'
            )
        },
    })
}
