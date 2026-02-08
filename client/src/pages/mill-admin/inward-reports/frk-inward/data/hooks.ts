import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as frkInwardService from './service'
import type {
    CreateFrkInwardRequest,
    FrkInwardQueryParams,
    UpdateFrkInwardRequest,
} from './types'

// Query Keys
export const frkInwardKeys = {
    all: (millId: string) => ['frk-inward', millId] as const,
    lists: (millId: string) => [...frkInwardKeys.all(millId), 'list'] as const,
    list: (millId: string, params: FrkInwardQueryParams) =>
        [...frkInwardKeys.lists(millId), params] as const,
    summary: (millId: string) =>
        [...frkInwardKeys.all(millId), 'summary'] as const,
}

/**
 * Hook to fetch frk inward list
 */
export function useFrkInwardList(
    millId: string,
    params: FrkInwardQueryParams = {}
) {
    return useQuery({
        queryKey: frkInwardKeys.list(millId, params),
        queryFn: () => frkInwardService.fetchFrkInwardList(millId, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

/**
 * Hook to fetch frk inward summary
 */
export function useFrkInwardSummary(
    millId: string,
    params: Pick<FrkInwardQueryParams, 'startDate' | 'endDate'> = {}
) {
    return useQuery({
        queryKey: frkInwardKeys.summary(millId),
        queryFn: () => frkInwardService.fetchFrkInwardSummary(millId, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!millId,
    })
}

/**
 * Hook to create frk inward entry
 */
export function useCreateFrkInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateFrkInwardRequest) =>
            frkInwardService.createFrkInward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.summary(millId),
            })
            toast.success('FRK inward entry created successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create FRK inward entry')
        },
    })
}

/**
 * Hook to update frk inward entry
 */
export function useUpdateFrkInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateFrkInwardRequest
        }) => frkInwardService.updateFrkInward(millId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.summary(millId),
            })
            toast.success('FRK inward entry updated successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update FRK inward entry')
        },
    })
}

/**
 * Hook to delete frk inward entry
 */
export function useDeleteFrkInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) =>
            frkInwardService.deleteFrkInward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.summary(millId),
            })
            toast.success('FRK inward entry deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete FRK inward entry')
        },
    })
}

/**
 * Hook to bulk delete frk inward entries
 */
export function useBulkDeleteFrkInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) =>
            frkInwardService.bulkDeleteFrkInward(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: frkInwardKeys.summary(millId),
            })
            toast.success('FRK inward entries deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete FRK inward entries')
        },
    })
}
