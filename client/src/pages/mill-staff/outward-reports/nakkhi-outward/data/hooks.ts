/**
 * Nakkhi Outward Hooks
 * React Query hooks for Nakkhi Outward data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchNakkhiOutwardList,
    fetchNakkhiOutwardById,
    fetchNakkhiOutwardSummary,
    createNakkhiOutward,
    updateNakkhiOutward,
    deleteNakkhiOutward,
    bulkDeleteNakkhiOutward,
    exportNakkhiOutward,
} from './service'
import type {
    NakkhiOutwardResponse,
    NakkhiOutwardListResponse,
    NakkhiOutwardSummaryResponse,
    CreateNakkhiOutwardRequest,
    UpdateNakkhiOutwardRequest,
    NakkhiOutwardQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const nakkhiOutwardKeys = {
    all: ['nakkhi-outward'] as const,
    lists: () => [...nakkhiOutwardKeys.all, 'list'] as const,
    list: (millId: string, params?: NakkhiOutwardQueryParams) =>
        [...nakkhiOutwardKeys.lists(), millId, params] as const,
    details: () => [...nakkhiOutwardKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...nakkhiOutwardKeys.details(), millId, id] as const,
    summaries: () => [...nakkhiOutwardKeys.all, 'summary'] as const,
    summary: (
        millId: string,
        params?: Pick<NakkhiOutwardQueryParams, 'startDate' | 'endDate'>
    ) => [...nakkhiOutwardKeys.summaries(), millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch nakkhi outward list with pagination and filters
 */
export const useNakkhiOutwardList = (
    millId: string,
    params?: NakkhiOutwardQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<NakkhiOutwardListResponse, Error>({
        queryKey: nakkhiOutwardKeys.list(millId, params),
        queryFn: () => fetchNakkhiOutwardList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single nakkhi outward entry
 */
export const useNakkhiOutwardDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<NakkhiOutwardResponse, Error>({
        queryKey: nakkhiOutwardKeys.detail(millId, id),
        queryFn: () => fetchNakkhiOutwardById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch nakkhi outward summary/statistics
 */
export const useNakkhiOutwardSummary = (
    millId: string,
    params?: Pick<NakkhiOutwardQueryParams, 'startDate' | 'endDate'>,
    options?: { enabled?: boolean }
) => {
    return useQuery<NakkhiOutwardSummaryResponse, Error>({
        queryKey: nakkhiOutwardKeys.summary(millId, params),
        queryFn: () => fetchNakkhiOutwardSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new nakkhi outward entry
 */
export const useCreateNakkhiOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateNakkhiOutwardRequest) =>
            createNakkhiOutward(millId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: nakkhiOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: nakkhiOutwardKeys.summaries(),
            })
            toast.success('Nakkhi outward entry created successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to create nakkhi outward entry'
            )
        },
    })
}

/**
 * Hook to update an existing nakkhi outward entry
 */
export const useUpdateNakkhiOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateNakkhiOutwardRequest) =>
            updateNakkhiOutward(millId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: nakkhiOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: nakkhiOutwardKeys.detail(millId, variables.id),
            })
            queryClient.invalidateQueries({
                queryKey: nakkhiOutwardKeys.summaries(),
            })
            toast.success('Nakkhi outward entry updated successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to update nakkhi outward entry'
            )
        },
    })
}

/**
 * Hook to delete a nakkhi outward entry
 */
export const useDeleteNakkhiOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteNakkhiOutward(millId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: nakkhiOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: nakkhiOutwardKeys.summaries(),
            })
            toast.success('Nakkhi outward entry deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete nakkhi outward entry'
            )
        },
    })
}

/**
 * Hook to bulk delete nakkhi outward entries
 */
export const useBulkDeleteNakkhiOutward = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => bulkDeleteNakkhiOutward(millId, ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: nakkhiOutwardKeys.lists(),
            })
            queryClient.invalidateQueries({
                queryKey: nakkhiOutwardKeys.summaries(),
            })
            toast.success('Nakkhi outward entries deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to delete nakkhi outward entries'
            )
        },
    })
}

/**
 * Hook to export nakkhi outward entries
 */
export const useExportNakkhiOutward = (millId: string) => {
    return useMutation({
        mutationFn: (params?: NakkhiOutwardQueryParams) =>
            exportNakkhiOutward(millId, params),
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `nakkhi-outward-export-${new Date().toISOString().split('T')[0]}.xlsx`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success('Export completed successfully')
        },
        onError: (error: Error) => {
            toast.error(
                error.message || 'Failed to export nakkhi outward entries'
            )
        },
    })
}
