import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    fetchKhandaOutwardList,
    fetchKhandaOutwardSummary,
    createKhandaOutward,
    updateKhandaOutward,
    deleteKhandaOutward,
    bulkDeleteKhandaOutward,
} from './service'
import type {
    KhandaOutwardQueryParams,
    CreateKhandaOutwardRequest,
    UpdateKhandaOutwardRequest,
} from './types'

const QUERY_KEY = 'khanda-outward'

export const useKhandaOutwardList = (
    millId: string,
    params: KhandaOutwardQueryParams = {}
) => {
    return useQuery({
        queryKey: [QUERY_KEY, 'list', millId, params],
        queryFn: () => fetchKhandaOutwardList(millId, params),
        enabled: !!millId,
    })
}

export const useKhandaOutwardSummary = (
    millId: string,
    params: Pick<KhandaOutwardQueryParams, 'startDate' | 'endDate'> = {}
) => {
    return useQuery({
        queryKey: [QUERY_KEY, 'summary', millId, params],
        queryFn: () => fetchKhandaOutwardSummary(millId, params),
        enabled: !!millId,
    })
}

export const useCreateKhandaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateKhandaOutwardRequest) =>
            createKhandaOutward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY, 'list', millId],
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY, 'summary', millId],
            })
        },
    })
}

export const useUpdateKhandaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateKhandaOutwardRequest
        }) => updateKhandaOutward(millId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY, 'list', millId],
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY, 'summary', millId],
            })
        },
    })
}

export const useDeleteKhandaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteKhandaOutward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY, 'list', millId],
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY, 'summary', millId],
            })
        },
    })
}

export const useBulkDeleteKhandaOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => bulkDeleteKhandaOutward(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY, 'list', millId],
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY, 'summary', millId],
            })
        },
    })
}
