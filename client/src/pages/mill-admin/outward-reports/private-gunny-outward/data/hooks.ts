import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    bulkDeletePrivateGunnyOutward,
    createPrivateGunnyOutward,
    deletePrivateGunnyOutward,
    fetchPrivateGunnyOutwardList,
    fetchPrivateGunnyOutwardSummary,
    updatePrivateGunnyOutward,
} from './service'
import type {
    CreatePrivateGunnyOutwardRequest,
    PrivateGunnyOutwardQueryParams,
    UpdatePrivateGunnyOutwardRequest,
} from './types'

// Query Keys Factory
export const privateGunnyOutwardKeys = {
    all: ['private-gunny-outward'] as const,
    lists: () => [...privateGunnyOutwardKeys.all, 'list'] as const,
    list: (millId: string, params: PrivateGunnyOutwardQueryParams) =>
        [...privateGunnyOutwardKeys.lists(), millId, params] as const,
    summaries: () => [...privateGunnyOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params: Pick<
            PrivateGunnyOutwardQueryParams,
            'startDate' | 'endDate' | 'search'
        >
    ) => [...privateGunnyOutwardKeys.summaries(), millId, params] as const,
}

// Queries
export const usePrivateGunnyOutwardList = (
    millId: string,
    params: PrivateGunnyOutwardQueryParams
) => {
    return useQuery({
        queryKey: privateGunnyOutwardKeys.list(millId, params),
        queryFn: () => fetchPrivateGunnyOutwardList(millId, params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

export const usePrivateGunnyOutwardSummary = (
    millId: string,
    params: Pick<
        PrivateGunnyOutwardQueryParams,
        'startDate' | 'endDate' | 'search'
    >
) => {
    return useQuery({
        queryKey: privateGunnyOutwardKeys.summary(millId, params),
        queryFn: () => fetchPrivateGunnyOutwardSummary(millId, params),
        staleTime: 5 * 60 * 1000,
    })
}

// Mutations
export const useCreatePrivateGunnyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: CreatePrivateGunnyOutwardRequest) =>
            createPrivateGunnyOutward(millId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.summaries(),
            })
            toast.success('Private gunny outward record created successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create record')
        },
    })
}

export const useUpdatePrivateGunnyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string
            payload: UpdatePrivateGunnyOutwardRequest
        }) => updatePrivateGunnyOutward(millId, id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.summaries(),
            })
            toast.success('Private gunny outward record updated successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update record')
        },
    })
}

export const useDeletePrivateGunnyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deletePrivateGunnyOutward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.summaries(),
            })
            toast.success('Private gunny outward record deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete record')
        },
    })
}

export const useBulkDeletePrivateGunnyOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) =>
            bulkDeletePrivateGunnyOutward(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: privateGunnyOutwardKeys.summaries(),
            })
            toast.success('Private gunny outward records deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete records')
        },
    })
}
