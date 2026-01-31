/**
 * Gunny Purchase Hooks
 * React Query hooks for Gunny Purchase data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchGunnyPurchaseList,
    fetchGunnyPurchaseById,
    fetchGunnyPurchaseSummary,
    createGunnyPurchase,
    updateGunnyPurchase,
    deleteGunnyPurchase,
    bulkDeleteGunnyPurchase,
    exportGunnyPurchase,
} from './service'
import type {
    GunnyPurchaseResponse,
    GunnyPurchaseListResponse,
    GunnyPurchaseSummaryResponse,
    CreateGunnyPurchaseRequest,
    UpdateGunnyPurchaseRequest,
    GunnyPurchaseQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const gunnyPurchaseKeys = {
    all: ['gunny-purchase'] as const,
    lists: () => [...gunnyPurchaseKeys.all, 'list'] as const,
    list: (millId: string, params?: GunnyPurchaseQueryParams) =>
        [...gunnyPurchaseKeys.lists(), millId, params] as const,
    details: () => [...gunnyPurchaseKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...gunnyPurchaseKeys.details(), millId, id] as const,
    summaries: () => [...gunnyPurchaseKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<GunnyPurchaseQueryParams, 'startDate' | 'endDate'>
    ) => [...gunnyPurchaseKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch gunny purchase list with pagination and filters
 */
export const useGunnyPurchaseList = (
    millId: string,
    params?: GunnyPurchaseQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<GunnyPurchaseListResponse, Error>({
        queryKey: gunnyPurchaseKeys.list(millId, params),
        queryFn: () => fetchGunnyPurchaseList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single gunny purchase entry
 */
export const useGunnyPurchaseDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<GunnyPurchaseResponse, Error>({
        queryKey: gunnyPurchaseKeys.detail(millId, id),
        queryFn: () => fetchGunnyPurchaseById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch gunny purchase summary/statistics
 */
export const useGunnyPurchaseSummary = (
    millId: string,
    params?: Pick<GunnyPurchaseQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<GunnyPurchaseSummaryResponse, Error>({
        queryKey: gunnyPurchaseKeys.summary(millId, params),
        queryFn: () => fetchGunnyPurchaseSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new gunny purchase entry
 */
export const useCreateGunnyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        GunnyPurchaseResponse,
        Error,
        CreateGunnyPurchaseRequest
    >({
        mutationFn: (data) => createGunnyPurchase(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseKeys.summaries(),
            })
            toast.success('Gunny purchase entry created successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to create gunny purchase entry'
            )
        },
    })
}

/**
 * Hook to update an existing gunny purchase entry
 */
export const useUpdateGunnyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        GunnyPurchaseResponse,
        Error,
        UpdateGunnyPurchaseRequest
    >({
        mutationFn: (data) => updateGunnyPurchase(millId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseKeys.lists(),
            })
            queryClient.setQueryData(
                gunnyPurchaseKeys.detail(millId, data._id),
                data
            )
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseKeys.summaries(),
            })
            toast.success('Gunny purchase entry updated successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to update gunny purchase entry'
            )
        },
    })
}

/**
 * Hook to delete a gunny purchase entry
 */
export const useDeleteGunnyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteGunnyPurchase(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseKeys.summaries(),
            })
            toast.success('Gunny purchase entry deleted successfully')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete gunny purchase entry'
            )
        },
    })
}

/**
 * Hook to bulk delete gunny purchase entries
 */
export const useBulkDeleteGunnyPurchase = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteGunnyPurchase(millId, ids),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: gunnyPurchaseKeys.summaries(),
            })
            toast.success(`${ids.length} entries deleted successfully`)
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to delete gunny purchase entries'
            )
        },
    })
}

/**
 * Hook to export gunny purchase entries
 */
export const useExportGunnyPurchase = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: GunnyPurchaseQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) =>
            exportGunnyPurchase(millId, params, format),
        onSuccess: () => {
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
