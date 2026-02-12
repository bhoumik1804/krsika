import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as silkyKodhaOutwardService from './service'
import type {
    CreateSilkyKodhaOutwardRequest,
    SilkyKodhaOutwardQueryParams,
    UpdateSilkyKodhaOutwardRequest,
} from './types'

export const silkyKodhaOutwardKeys = {
    all: (millId: string) => ['silky-kodha-outward', millId] as const,
    lists: (millId: string) =>
        [...silkyKodhaOutwardKeys.all(millId), 'list'] as const,
    list: (millId: string, params: SilkyKodhaOutwardQueryParams) =>
        [...silkyKodhaOutwardKeys.lists(millId), params] as const,
    summary: (millId: string) =>
        [...silkyKodhaOutwardKeys.all(millId), 'summary'] as const,
}

export function useSilkyKodhaOutwardList(
    millId: string,
    params: SilkyKodhaOutwardQueryParams = {}
) {
    return useQuery({
        queryKey: silkyKodhaOutwardKeys.list(millId, params),
        queryFn: () =>
            silkyKodhaOutwardService.fetchSilkyKodhaOutwardList(millId, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

export function useSilkyKodhaOutwardSummary(
    millId: string,
    params: Pick<SilkyKodhaOutwardQueryParams, 'startDate' | 'endDate'> = {}
) {
    return useQuery({
        queryKey: silkyKodhaOutwardKeys.summary(millId),
        queryFn: () =>
            silkyKodhaOutwardService.fetchSilkyKodhaOutwardSummary(
                millId,
                params
            ),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

export function useCreateSilkyKodhaOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateSilkyKodhaOutwardRequest) =>
            silkyKodhaOutwardService.createSilkyKodhaOutward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.summary(millId),
            })
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to create silky kodha outward entry'
            )
        },
    })
}

export function useUpdateSilkyKodhaOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateSilkyKodhaOutwardRequest
        }) =>
            silkyKodhaOutwardService.updateSilkyKodhaOutward(millId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.summary(millId),
            })
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to update silky kodha outward entry'
            )
        },
    })
}

export function useDeleteSilkyKodhaOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) =>
            silkyKodhaOutwardService.deleteSilkyKodhaOutward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.summary(millId),
            })
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete silky kodha outward entry'
            )
        },
    })
}

export function useBulkDeleteSilkyKodhaOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) =>
            silkyKodhaOutwardService.bulkDeleteSilkyKodhaOutward(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: silkyKodhaOutwardKeys.summary(millId),
            })
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete silky kodha outward entries'
            )
        },
    })
}
