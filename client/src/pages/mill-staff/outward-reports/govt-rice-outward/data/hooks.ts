import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as govtRiceOutwardService from './service'
import type {
    CreateGovtRiceOutwardRequest,
    GovtRiceOutwardQueryParams,
    UpdateGovtRiceOutwardRequest,
} from './types'

export const govtRiceOutwardKeys = {
    all: (millId: string) => ['govt-rice-outward', millId] as const,
    lists: (millId: string) =>
        [...govtRiceOutwardKeys.all(millId), 'list'] as const,
    list: (millId: string, params: GovtRiceOutwardQueryParams) =>
        [...govtRiceOutwardKeys.lists(millId), params] as const,
    summary: (millId: string) =>
        [...govtRiceOutwardKeys.all(millId), 'summary'] as const,
}

export function useGovtRiceOutwardList(
    millId: string,
    params: GovtRiceOutwardQueryParams = {}
) {
    return useQuery({
        queryKey: govtRiceOutwardKeys.list(millId, params),
        queryFn: () =>
            govtRiceOutwardService.fetchGovtRiceOutwardList(millId, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

export function useGovtRiceOutwardSummary(
    millId: string,
    params: Pick<GovtRiceOutwardQueryParams, 'startDate' | 'endDate'> = {}
) {
    return useQuery({
        queryKey: govtRiceOutwardKeys.summary(millId),
        queryFn: () =>
            govtRiceOutwardService.fetchGovtRiceOutwardSummary(millId, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

export function useCreateGovtRiceOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateGovtRiceOutwardRequest) =>
            govtRiceOutwardService.createGovtRiceOutward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.summary(millId),
            })
            toast.success('Govt rice outward entry created successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to create govt rice outward entry'
            )
        },
    })
}

export function useUpdateGovtRiceOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateGovtRiceOutwardRequest
        }) => govtRiceOutwardService.updateGovtRiceOutward(millId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.summary(millId),
            })
            toast.success('Govt rice outward entry updated successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to update govt rice outward entry'
            )
        },
    })
}

export function useDeleteGovtRiceOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) =>
            govtRiceOutwardService.deleteGovtRiceOutward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.summary(millId),
            })
            toast.success('Govt rice outward entry deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete govt rice outward entry'
            )
        },
    })
}

export function useBulkDeleteGovtRiceOutward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) =>
            govtRiceOutwardService.bulkDeleteGovtRiceOutward(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: govtRiceOutwardKeys.summary(millId),
            })
            toast.success('Govt rice outward entries deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete govt rice outward entries'
            )
        },
    })
}
