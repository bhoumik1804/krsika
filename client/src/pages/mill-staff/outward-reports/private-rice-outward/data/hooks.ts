import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as privateRiceOutwardService from './service'
import type {
    CreatePrivateRiceOutwardRequest,
    PrivateRiceOutwardQueryParams,
    UpdatePrivateRiceOutwardRequest,
} from './types'

export const privateRiceOutwardKeys = {
    all: (millId: string) => ['private-rice-outward', millId] as const,
    lists: (millId: string) =>
        [...privateRiceOutwardKeys.all(millId), 'list'] as const,
    list: (millId: string, params: PrivateRiceOutwardQueryParams) =>
        [...privateRiceOutwardKeys.lists(millId), params] as const,
    summary: (millId: string) =>
        [...privateRiceOutwardKeys.all(millId), 'summary'] as const,
}

export function usePrivateRiceOutwardList(
    millId: string,
    params: PrivateRiceOutwardQueryParams = {}
) {
    return useQuery({
        queryKey: privateRiceOutwardKeys.list(millId, params),
        queryFn: () =>
            privateRiceOutwardService.fetchPrivateRiceOutwardList(millId, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

export function usePrivateRiceOutwardSummary(
    millId: string,
    params: Pick<PrivateRiceOutwardQueryParams, 'startDate' | 'endDate'> = {}
) {
    return useQuery({
        queryKey: privateRiceOutwardKeys.summary(millId),
        queryFn: () =>
            privateRiceOutwardService.fetchPrivateRiceOutwardSummary(
                millId,
                params
            ),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

export function useCreatePrivateRiceOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreatePrivateRiceOutwardRequest) =>
            privateRiceOutwardService.createPrivateRiceOutward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.summary(millId),
            })
            toast.success('Private rice outward entry created successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to create private rice outward entry'
            )
        },
    })
}

export function useUpdatePrivateRiceOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdatePrivateRiceOutwardRequest
        }) =>
            privateRiceOutwardService.updatePrivateRiceOutward(millId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.summary(millId),
            })
            toast.success('Private rice outward entry updated successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to update private rice outward entry'
            )
        },
    })
}

export function useDeletePrivateRiceOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) =>
            privateRiceOutwardService.deletePrivateRiceOutward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.summary(millId),
            })
            toast.success('Private rice outward entry deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete private rice outward entry'
            )
        },
    })
}

export function useBulkDeletePrivateRiceOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) =>
            privateRiceOutwardService.bulkDeletePrivateRiceOutward(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: privateRiceOutwardKeys.summary(millId),
            })
            toast.success('Private rice outward entries deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message ||
                    'Failed to delete private rice outward entries'
            )
        },
    })
}
