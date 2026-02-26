import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    bulkDeleteFrkOutward,
    createFrkOutward,
    deleteFrkOutward,
    fetchFrkOutwardList,
    fetchFrkOutwardSummary,
    updateFrkOutward,
} from './service'
import type {
    CreateFrkOutwardRequest,
    FrkOutwardQueryParams,
    UpdateFrkOutwardRequest,
} from './types'

// Query Keys Factory
export const frkOutwardKeys = {
    all: ['frk-outward'] as const,
    lists: () => [...frkOutwardKeys.all, 'list'] as const,
    list: (millId: string, params: FrkOutwardQueryParams) =>
        [...frkOutwardKeys.lists(), millId, params] as const,
    summaries: () => [...frkOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params: Pick<
            FrkOutwardQueryParams,
            'startDate' | 'endDate' | 'partyName'
        >
    ) => [...frkOutwardKeys.summaries(), millId, params] as const,
}

// Queries
export const useFrkOutwardList = (
    millId: string,
    params: FrkOutwardQueryParams
) => {
    return useQuery({
        queryKey: frkOutwardKeys.list(millId, params),
        queryFn: () => fetchFrkOutwardList(millId, params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

export const useFrkOutwardSummary = (
    millId: string,
    params: Pick<FrkOutwardQueryParams, 'startDate' | 'endDate' | 'partyName'>
) => {
    return useQuery({
        queryKey: frkOutwardKeys.summary(millId, params),
        queryFn: () => fetchFrkOutwardSummary(millId, params),
        staleTime: 5 * 60 * 1000,
    })
}

// Mutations
export const useCreateFrkOutward = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            millId,
            payload,
        }: {
            millId: string
            payload: CreateFrkOutwardRequest
        }) => createFrkOutward(millId, payload),
        onSuccess: (_data, _variables) => {
            queryClient.invalidateQueries({
                queryKey: frkOutwardKeys.lists(),
            })
            toast.success('FRK outward created successfully')
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || 'Failed to create FRK outward'
            )
        },
    })
}

export const useUpdateFrkOutward = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            millId,
            id,
            payload,
        }: {
            millId: string
            id: string
            payload: UpdateFrkOutwardRequest
        }) => updateFrkOutward(millId, id, payload),
        onSuccess: (_data, _variables) => {
            queryClient.invalidateQueries({
                queryKey: frkOutwardKeys.lists(),
            })
            toast.success('FRK outward updated successfully')
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || 'Failed to update FRK outward'
            )
        },
    })
}

export const useDeleteFrkOutward = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ millId, id }: { millId: string; id: string }) =>
            deleteFrkOutward(millId, id),
        onSuccess: (_data, _variables) => {
            queryClient.invalidateQueries({
                queryKey: frkOutwardKeys.lists(),
            })
            toast.success('FRK outward deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || 'Failed to delete FRK outward'
            )
        },
    })
}

export const useBulkDeleteFrkOutward = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            millId,
            ids,
        }: {
            millId: string
            ids: string[]
        }) => bulkDeleteFrkOutward(millId, ids),
        onSuccess: (_data, _variables) => {
            queryClient.invalidateQueries({
                queryKey: frkOutwardKeys.lists(),
            })
            toast.success('FRK outward entries deleted successfully')
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message ||
                    'Failed to delete FRK outward entries'
            )
        },
    })
}
