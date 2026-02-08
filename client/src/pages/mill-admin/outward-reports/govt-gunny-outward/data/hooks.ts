import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as govtGunnyOutwardService from './service'
import type {
    CreateGovtGunnyOutwardRequest,
    GovtGunnyOutwardQueryParams,
    UpdateGovtGunnyOutwardRequest,
} from './types'

export const govtGunnyOutwardKeys = {
    all: (millId: string) => ['govt-gunny-outward', millId] as const,
    lists: (millId: string) =>
        [...govtGunnyOutwardKeys.all(millId), 'list'] as const,
    list: (millId: string, params: GovtGunnyOutwardQueryParams) =>
        [...govtGunnyOutwardKeys.lists(millId), params] as const,
    summary: (millId: string) =>
        [...govtGunnyOutwardKeys.all(millId), 'summary'] as const,
}

export function useGovtGunnyOutwardList(
    millId: string,
    params: GovtGunnyOutwardQueryParams = {}
) {
    return useQuery({
        queryKey: govtGunnyOutwardKeys.list(millId, params),
        queryFn: () =>
            govtGunnyOutwardService.fetchGovtGunnyOutwardList(millId, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

export function useGovtGunnyOutwardSummary(
    millId: string,
    params: Pick<GovtGunnyOutwardQueryParams, 'startDate' | 'endDate'> = {}
) {
    return useQuery({
        queryKey: govtGunnyOutwardKeys.summary(millId),
        queryFn: () =>
            govtGunnyOutwardService.fetchGovtGunnyOutwardSummary(
                millId,
                params
            ),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

export function useCreateGovtGunnyOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateGovtGunnyOutwardRequest) =>
            govtGunnyOutwardService.createGovtGunnyOutward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.summary(millId),
            })
            toast.success('Govt gunny outward entry created successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to create govt gunny outward entry'
            )
        },
    })
}

export function useUpdateGovtGunnyOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateGovtGunnyOutwardRequest
        }) => govtGunnyOutwardService.updateGovtGunnyOutward(millId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.summary(millId),
            })
            toast.success('Govt gunny outward entry updated successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to update govt gunny outward entry'
            )
        },
    })
}

export function useDeleteGovtGunnyOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) =>
            govtGunnyOutwardService.deleteGovtGunnyOutward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.summary(millId),
            })
            toast.success('Govt gunny outward entry deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete govt gunny outward entry'
            )
        },
    })
}

export function useBulkDeleteGovtGunnyOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) =>
            govtGunnyOutwardService.bulkDeleteGovtGunnyOutward(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: govtGunnyOutwardKeys.summary(millId),
            })
            toast.success('Govt gunny outward entries deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete govt gunny outward entries'
            )
        },
    })
}
