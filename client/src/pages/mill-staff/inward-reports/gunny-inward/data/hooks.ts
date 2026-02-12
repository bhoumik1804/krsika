import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as gunnyInwardService from './service'
import type {
    GunnyInwardQueryParams,
    CreateGunnyInwardRequest,
    UpdateGunnyInwardRequest,
} from './types'

// Query Keys
export const gunnyInwardKeys = {
    all: (millId: string) => ['gunny-inward', millId] as const,
    lists: (millId: string) =>
        [...gunnyInwardKeys.all(millId), 'list'] as const,
    list: (millId: string, params: GunnyInwardQueryParams) =>
        [...gunnyInwardKeys.lists(millId), params] as const,
    summary: (millId: string) =>
        [...gunnyInwardKeys.all(millId), 'summary'] as const,
}

/**
 * Hook to fetch gunny inward list
 */
export function useGunnyInwardList(
    millId: string,
    params: GunnyInwardQueryParams = {}
) {
    return useQuery({
        queryKey: gunnyInwardKeys.list(millId, params),
        queryFn: () => gunnyInwardService.fetchGunnyInwardList(millId, params),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!millId,
    })
}

/**
 * Hook to fetch gunny inward summary
 */
export function useGunnyInwardSummary(millId: string) {
    return useQuery({
        queryKey: gunnyInwardKeys.summary(millId),
        queryFn: () => gunnyInwardService.fetchGunnyInwardSummary(millId),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!millId,
    })
}

/**
 * Hook to create gunny inward entry
 */
export function useCreateGunnyInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateGunnyInwardRequest) =>
            gunnyInwardService.createGunnyInward(millId, data),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.summary(millId),
            })
            toast.success('Gunny inward entry created successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create gunny inward entry')
        },
    })
}

/**
 * Hook to update gunny inward entry
 */
export function useUpdateGunnyInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateGunnyInwardRequest
        }) => gunnyInwardService.updateGunnyInward(millId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.summary(millId),
            })
            toast.success('Gunny inward entry updated successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update gunny inward entry')
        },
    })
}

/**
 * Hook to delete gunny inward entry
 */
export function useDeleteGunnyInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) =>
            gunnyInwardService.deleteGunnyInward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.summary(millId),
            })
            toast.success('Gunny inward entry deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete gunny inward entry')
        },
    })
}

/**
 * Hook to bulk delete gunny inward entries
 */
export function useBulkDeleteGunnyInward(millId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) =>
            gunnyInwardService.bulkDeleteGunnyInward(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.lists(millId),
            })
            queryClient.invalidateQueries({
                queryKey: gunnyInwardKeys.summary(millId),
            })
            toast.success('Gunny inward entries deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete gunny inward entries'
            )
        },
    })
}
