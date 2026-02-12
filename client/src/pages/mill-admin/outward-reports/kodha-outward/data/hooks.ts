import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as kodhaOutwardService from './service'
import type {
    CreateKodhaOutwardRequest,
    KodhaOutwardQueryParams,
    UpdateKodhaOutwardRequest,
} from './types'

export const kodhaOutwardKeys = {
    all: (millId: string) => ['kodha-outward', millId] as const,
    lists: (millId: string) =>
        [...kodhaOutwardKeys.all(millId), 'list'] as const,
    list: (millId: string, params: KodhaOutwardQueryParams) =>
        [...kodhaOutwardKeys.lists(millId), params] as const,
    summary: (millId: string) =>
        [...kodhaOutwardKeys.all(millId), 'summary'] as const,
}

export function useKodhaOutwardList(
    millId: string,
    params: KodhaOutwardQueryParams = {}
) {
    return useQuery({
        queryKey: kodhaOutwardKeys.list(millId, params),
        queryFn: () =>
            kodhaOutwardService.fetchKodhaOutwardList(millId, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

export function useKodhaOutwardSummary(
    millId: string,
    params: Pick<KodhaOutwardQueryParams, 'startDate' | 'endDate'> = {}
) {
    return useQuery({
        queryKey: kodhaOutwardKeys.summary(millId),
        queryFn: () =>
            kodhaOutwardService.fetchKodhaOutwardSummary(millId, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

export function useCreateKodhaOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateKodhaOutwardRequest) =>
            kodhaOutwardService.createKodhaOutward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.summary(millId),
            })
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create kodha outward entry')
        },
    })
}

export function useUpdateKodhaOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateKodhaOutwardRequest
        }) => kodhaOutwardService.updateKodhaOutward(millId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.summary(millId),
            })
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update kodha outward entry')
        },
    })
}

export function useDeleteKodhaOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) =>
            kodhaOutwardService.deleteKodhaOutward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.summary(millId),
            })
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete kodha outward entry')
        },
    })
}

export function useBulkDeleteKodhaOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) =>
            kodhaOutwardService.bulkDeleteKodhaOutward(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: kodhaOutwardKeys.summary(millId),
            })
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete kodha outward entries'
            )
        },
    })
}
