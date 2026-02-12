import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    fetchBhusaOutwardList,
    fetchBhusaOutwardSummary,
    createBhusaOutward,
    updateBhusaOutward,
    deleteBhusaOutward,
    bulkDeleteBhusaOutward,
} from './service'
import type {
    BhusaOutwardQueryParams,
    CreateBhusaOutwardRequest,
    UpdateBhusaOutwardRequest,
} from './types'

const QUERY_KEY = 'bhusa-outward'

export const useBhusaOutwardList = (
    millId: string,
    params: BhusaOutwardQueryParams = {}
) => {
    return useQuery({
        queryKey: [QUERY_KEY, 'list', millId, params],
        queryFn: () => fetchBhusaOutwardList(millId, params),
        enabled: !!millId,
    })
}

export const useBhusaOutwardSummary = (
    millId: string,
    params: { startDate?: string; endDate?: string } = {}
) => {
    return useQuery({
        queryKey: [QUERY_KEY, 'summary', millId, params],
        queryFn: () => fetchBhusaOutwardSummary(millId, params),
        enabled: !!millId,
    })
}

export const useCreateBhusaOutward = (millId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateBhusaOutwardRequest) =>
            createBhusaOutward(millId, data),
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

export const useUpdateBhusaOutward = (millId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateBhusaOutwardRequest
        }) => updateBhusaOutward(millId, id, data),
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

export const useDeleteBhusaOutward = (millId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteBhusaOutward(millId, id),
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

export const useBulkDeleteBhusaOutward = (millId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (ids: string[]) => bulkDeleteBhusaOutward(millId, ids),
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
