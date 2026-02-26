import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    fetchNakkhiOutwardList,
    fetchNakkhiOutwardSummary,
    createNakkhiOutward,
    updateNakkhiOutward,
    deleteNakkhiOutward,
    bulkDeleteNakkhiOutward,
} from './service'
import type {
    NakkhiOutwardQueryParams,
    CreateNakkhiOutwardRequest,
    UpdateNakkhiOutwardRequest,
} from './types'

const QUERY_KEY = 'nakkhi-outward'

export const useNakkhiOutwardList = (
    millId: string,
    params: NakkhiOutwardQueryParams = {}
) => {
    return useQuery({
        queryKey: [QUERY_KEY, 'list', millId, params],
        queryFn: () => fetchNakkhiOutwardList(millId, params),
        enabled: !!millId,
    })
}

export const useNakkhiOutwardSummary = (
    millId: string,
    params: Pick<NakkhiOutwardQueryParams, 'startDate' | 'endDate'> = {}
) => {
    return useQuery({
        queryKey: [QUERY_KEY, 'summary', millId, params],
        queryFn: () => fetchNakkhiOutwardSummary(millId, params),
        enabled: !!millId,
    })
}

export const useCreateNakkhiOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateNakkhiOutwardRequest) =>
            createNakkhiOutward(millId, data),
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

export const useUpdateNakkhiOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateNakkhiOutwardRequest
        }) => updateNakkhiOutward(millId, id, data),
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

export const useDeleteNakkhiOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteNakkhiOutward(millId, id),
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

export const useBulkDeleteNakkhiOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => bulkDeleteNakkhiOutward(millId, ids),
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
